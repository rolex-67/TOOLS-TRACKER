import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MasterInfoReport = () => {
  const [masterData, setMasterData] = useState([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/master-info'); // 🔀 update to your backend route
        setMasterData(res.data);
      } catch (err) {
        console.error('Failed to fetch master info:', err);
      }
    };

    fetchMasterData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Master Info Report</h2>

      {masterData.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <ul className="space-y-2">
          {masterData.map((item, index) => (
            <li key={index} className="border p-2 rounded">
              <p><strong>Tool Name:</strong> {item.toolName}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              {/* Add other master data fields here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MasterInfoReport;
