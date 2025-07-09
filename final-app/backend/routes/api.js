const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Appointed = require('../models/Appointed');
const UsersUsingTool = require('../models/UsersUsingTool');

router.post('/request', async (req, res) => {
  const { toolId, toolName, userId, requestedDays, reason } = req.body;

  try {
    await Request.create({
      toolId,
      toolName,
      userId,
      requestedDays, // ✅ added
      reason,        // ✅ added
      status: 'pending'
    });
    res.status(201).json({ message: 'Request created successfully' });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

// ✅ Toolskeeper appoints tool
router.post('/appoint', async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'appointed';
    await request.save();

    await Appointed.create({
      toolId: request.toolId,
      toolName: request.toolName,
      userId: request.userId,
      quantity: 1,
      requestedDays: request.requestedDays, // ✅ added
      reason: request.reason,               // ✅ added
      status: 'appointed'
    });

    res.json({ message: 'Tool appointed by toolskeeper' });
  } catch (err) {
    console.error('Error in appoint route:', err);
    res.status(500).json({ message: 'Failed to appoint tool' });
  }
});




// ✅ Admin approves appointed tool (final step before UsersUsingTools)
router.post('/appoint/:id/approve', async (req, res) => {
  try {
    const appointed = await Appointed.findById(req.params.id);
    if (!appointed) {
      return res.status(404).json({ message: 'Appointed tool not found' });
    }

    console.log('✅ Appointed data:', appointed);

    const appointedAt = new Date();
    const returnDate = new Date(appointedAt);
    returnDate.setDate(returnDate.getDate() + (appointed.requestedDays || 0)); // ✅ set returnDate based on requestedDays

    // ✅ Insert into UsersUsingTool collection
    const newUserTool = new UsersUsingTool({
      toolId: appointed.toolId,
      toolName: appointed.toolName,
      userId: appointed.userId,
      appointedAt: appointedAt,
      requestedDays: appointed.requestedDays, // ✅ added
      returnDate: returnDate,
      reason: appointed.reason,               // ✅ added
      condition: null
    });

    await newUserTool.save();
    console.log('✅ New user tool inserted');

    // ✅ Delete from Appointed collection after approval
    await Appointed.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tool approved and moved to UsersUsingTools' });
  } catch (err) {
    console.error('❌ Error approving appointed tool:', err);
    res.status(500).json({ message: 'Failed to approve appointed tool' });
  }
});


// Admin approves request
router.post('/requests/:id/approve', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'approved';
    await request.save();

    // ✅ Save to UsersUsingTool collection
    await UsersUsingTool.create({
      toolId: request.toolId,
      toolName: request.toolName,
      userId: request.userId,
      appointedAt: new Date(),
      returnDate: null, // set when user returns
      condition: null
    });

    res.json({ message: 'Request approved by admin and saved to UsersUsingTools' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve request' });
  }
});


// ✅ Get pending requests for toolskeeper
router.get('/requests', async (req, res) => {
  const requests = await Request.find({ status: 'pending' });
  res.json(requests);
});

// ✅ Get appointed items for admin approval
router.get('/appointed', async (req, res) => {
  const appointed = await Appointed.find({ status: 'appointed' });
  res.json(appointed);
});


// ✅ Get all users currently using tools
router.get('/users-using-tools', async (req, res) => {
  try {
    const tools = await UsersUsingTool.find();
    console.log('✅ UsersUsingTool fetched:', tools);
    res.json(tools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users using tools' });
  }
});





// Admin rejects request
router.post('/requests/:id/reject', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected by admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject request' });
  }
});

// Admin rejects an appointed tool (optional)
router.post('/appoint/:id/reject', async (req, res) => {
  try {
    await Appointed.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointed tool rejected and removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject appointed tool' });
  }
});



// ✅ Get all users currently using tools
router.get('/users-using-tools', async (req, res) => {
  try {
    const tools = await UsersUsingTool.find();
    res.json(tools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users using tools' });
  }
});

// ✅ Get tools currently used by a specific user
router.get('/returns/:email', async (req, res) => {
  try {
    const userId = req.params.email;
    const tools = await UsersUsingTool.find({
      userId,
      status: { $ne: 'Closed' } // ✅ exclude closed items
    });
    res.json(tools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch return items for user' });
  }
});





// ✅ Confirm return
// backend/routes/api.js

// PUT /api/returns/:id/confirm
// backend/routes/api.js (within confirm return route)

router.put('/returns/:toolId/confirm', async (req, res) => {
  const { condition, actualReturnDate } = req.body;

  try {
    const tool = await UsersUsingTool.findById(req.params.toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    tool.condition = condition;
    tool.actualReturnDate = actualReturnDate; // ✅ correctly save
    tool.status = 'Closed'; // ✅ update status

    await tool.save();

    res.json({ message: 'Tool return confirmed', tool }); // send updated tool back

  } catch (err) {
    console.error('❌ Error confirming return:', err);
    res.status(500).json({ message: 'Failed to confirm return' });
  }
});



// GET /api/stock-report/:email
router.get('/stock-report/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const tools = await UsersUsingTool.find({ userId: email });
    res.json(tools);
  } catch (err) {
    console.error('❌ Error fetching stock report:', err);
    res.status(500).json({ message: 'Failed to fetch stock report' });
  }
});

// ✅ Get all overdue tools
router.get('/missing-tools', async (req, res) => {
  try {
    const today = new Date();

    // Fetch all tools whose due returnDate is before today and status not Closed
    const overdueTools = await UsersUsingTool.find({
      returnDate: { $lt: today },
      status: { $ne: 'Closed' }
    });

    res.json(overdueTools);
  } catch (err) {
    console.error('❌ Error fetching missing tools:', err);
    res.status(500).json({ message: 'Failed to fetch missing tools' });
  }
});

// ✅ Set or update role of a user (excluding Admin changes by others)
router.post('/set-role', async (req, res) => {
  const { userId, role } = req.body;

  if (role === 'Admin') {
    return res.status(403).json({ message: "Cannot assign Admin role through this route" });
  }

  try {
    const user = await User.findOne({ email: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update role' });
  }
});


module.exports = router;
