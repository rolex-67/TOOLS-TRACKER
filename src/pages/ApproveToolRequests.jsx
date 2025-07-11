import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApproveToolRequests = () => {
  const [appointed, setAppointed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      alert("❌ Only Admin can approve appointed tools. Please login.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/appointed")
      .then((res) => setAppointed(res.data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/appoint/${id}/approve`);
      alert("✅ Tool approved and moved to UsersUsingTools");
      setAppointed(appointed.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to approve tool");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/appoint/${id}/reject`);
      alert("❌ Request rejected.");
      setAppointed(appointed.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to reject request.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Approve Appointed Tools</h2>
      {appointed.length === 0 ? (
        <p>No appointed tools pending approval.</p>
      ) : (
        <ul className="space-y-3">
          {appointed.map((a) => (
            <li key={a._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
              <p><strong>Tool:</strong> {a.toolName}</p>
              <p><strong>User:</strong> {a.userId}</p>
              <p><strong>Requested Days:</strong> {a.requestedDays || 'N/A'}</p>
              <p><strong>Reason:</strong> {a.reason || 'N/A'}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleApprove(a._id)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(a._id)}
                  className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveToolRequests;
