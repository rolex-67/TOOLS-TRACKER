import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppointItem = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Toolskeeper") {
      alert("❌ Only Toolskeeper can appoint tools. Please login.");
      navigate("/login");
      return;
    }

    // ✅ Fetch pending requests from backend
    axios
      .get("http://localhost:5000/api/requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Failed to fetch requests:", err));
  }, [navigate]);

  const handleAppoint = async (request) => {
    try {
      // ✅ Send requestId only, as expected by backend route
      await axios.post("http://localhost:5000/api/appoint", {
        requestId: request._id,
      });

      alert(`✅ Tool "${request.toolName}" appointed successfully.`);
      // ✅ Remove appointed request from local state to update UI
      setRequests(requests.filter((r) => r._id !== request._id));
    } catch (err) {
      console.error("Error appointing tool:", err);
      alert("❌ Failed to appoint tool.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/requests/${requestId}/reject`
      );
      alert("❌ Request rejected.");
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(err);
      alert("Failed to reject request.");
    }
  };

  const handleRequest = async (tool) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const requestedDays = prompt("Enter number of days required:");
    const reason = prompt("Enter reason for requesting this tool:");

    if (!requestedDays || !reason) {
      alert("❌ Both days and reason are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/request", {
        toolId: tool.id,
        toolName: tool.title,
        userId: user.email,
        requestedDays: requestedDays,
        reason: reason,
      });
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      alert("❌ Failed to request tool.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Requests to Appoint</h2>
      {requests.length === 0 ? (
        <p>No pending requests to appoint.</p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r._id} className="mb-2">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <p>
                  <strong>Tool:</strong> {r.toolName}
                </p>
                <p>
                  <strong>Requested by:</strong> {r.userId}
                </p>
                <p>
                  <strong>Requested Days:</strong> {r.requestedDays || "N/A"}
                </p>
                <p>
                  <strong>Reason:</strong> {r.reason || "N/A"}
                </p>
                <button
                  onClick={() => handleAppoint(r)}
                  className="bg-green-700 text-white px-3 py-1 rounded mt-2 mr-2"
                >
                  Appoint
                </button>
                <button
                  onClick={() => handleReject(r._id)}
                  className="bg-red-700 text-white px-3 py-1 rounded mt-2"
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

export default AppointItem;
