import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MissingToolList = () => {
  const [missingTools, setMissingTools] = useState([]);

  useEffect(() => {
    const fetchMissingTools = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/missing-tools');
        setMissingTools(res.data || []);
      } catch (err) {
        console.error('❌ Error fetching missing tools:', err);
      }
    };

    fetchMissingTools();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Missing Tool List</h2>
      {missingTools.length === 0 ? (
        <p>✅ No tools are currently overdue.</p>
      ) : (
        <ul className="space-y-4">
          {missingTools.map(t => {
            const appointedDate = new Date(t.appointedAt);
            const dueDate = new Date(appointedDate);
            dueDate.setDate(appointedDate.getDate() + (t.requestedDays || 0));

            const today = new Date();
            const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

            return (
              <li
                key={t._id}
                className="bg-red-100 dark:bg-red-800 p-4 rounded shadow"
              >
                <p><strong>Tool:</strong> {t.toolName}</p>
                <p><strong>Issued to:</strong> {t.userId}</p>
                <p><strong>Requested Days:</strong> {t.requestedDays || 'N/A'}</p>
                <p><strong>Issued On:</strong> {appointedDate.toLocaleDateString()}</p>
                <p><strong>Return By:</strong> {dueDate.toLocaleDateString()}</p>
                <p className="text-red-600 font-bold">⚠️ Days Overdue: {daysOverdue}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MissingToolList;
