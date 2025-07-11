import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersUsingTools = () => {
  const [tools, setTools] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users-using-tools"
      );
      console.log("✅ UsersUsingTools fetched:", res.data);
      setTools(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching users using tools:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users Using Tools</h2>

      <button
        onClick={fetchData}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
      >
        🔄 Refresh
      </button>

      {tools.length === 0 ? (
        <p>No tools currently in use.</p>
      ) : (
        <ul className="space-y-2">
          {tools.map((t) => (
            <li
              key={t._id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow"
            >
              <p>
                <strong>Tool:</strong> {t.toolName}
              </p>
              <p>
                <strong>Issued to:</strong> {t.userId}
              </p>
              <p>
                <strong>Requested Days:</strong> {t.requestedDays || "N/A"}
              </p>
              <p>
                <strong>Reason:</strong> {t.reason || "N/A"}
              </p>
              <p>
                <strong>Issued On:</strong>{" "}
                {t.appointedAt
                  ? new Date(t.appointedAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Return By:</strong>{" "}
                {t.returnDate
                  ? new Date(t.returnDate).toLocaleDateString()
                  : "N/A"}
              </p>
              {/* <p><strong>Condition:</strong> {t.condition || 'Pending'}</p> */}
              <p>
                <strong>Status:</strong> {t.status}
              </p>
              {t.actualReturnDate && (
                <p>
                  <strong>Actual Return Date:</strong>{" "}
                  {new Date(t.actualReturnDate).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersUsingTools;
