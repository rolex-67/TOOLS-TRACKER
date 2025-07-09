// backend/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Mongo connected');

  const adminPass = await bcrypt.hash('admin', 10);
  const toolsPass = await bcrypt.hash('toolskeeper', 10);

  // Insert Admin if not exists
  const admin = await User.findOne({ role: 'Admin' });
  if (!admin) {
    await User.create({ email: 'admin@gmail.com', password: adminPass, role: 'Admin' });
    console.log('✅ Admin user created');
  }

  // Insert Toolskeeper if not exists
  const keeper = await User.findOne({ role: 'Toolskeeper' });
  if (!keeper) {
    await User.create({ email: 'toolskeeper@gmail.com', password: toolsPass, role: 'Toolskeeper' });
    console.log('✅ Toolskeeper user created');
  }

  mongoose.disconnect();
}

seed();
