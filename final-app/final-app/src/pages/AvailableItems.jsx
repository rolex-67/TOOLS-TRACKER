import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AvailableItems = () => {
  const [tools, setTools] = useState([]);
  const [requestedDays, setRequestedDays] = useState({});
  const [reasons, setReasons] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "User") {
      alert("❌ Only Users can view available items. Please login.");
      navigate('/login');
      return;
    }

    axios.get("https://dummyjson.com/products")
      .then((res) => setTools(res.data.products.filter((t) => t.stock > 0)))
      .catch((err) => console.error("AXIOS ERROR:", err));
  }, [navigate]);

  const handleRequest = async (tool) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const days = requestedDays[tool.id];
    const reason = reasons[tool.id];

    if (!days || !reason) {
      alert("❌ Please enter both number of days and reason before requesting.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/request", {
        toolId: tool.id,
        toolName: tool.title,
        userId: user.email,
        requestedDays: days,
        reason: reason
      });
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      alert("❌ Failed to request tool.");
    }
  };

  const handleDaysChange = (id, value) => {
    setRequestedDays({ ...requestedDays, [id]: value });
  };

  const handleReasonChange = (id, value) => {
    setReasons({ ...reasons, [id]: value });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tools.length > 0 ? (
          tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 rounded shadow p-4"
            >
              <img
                src={tool.thumbnail}
                alt={tool.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{tool.title}</h3>
              <p className="font-bold mt-1">ID: {tool.id}</p>
              
              <input
                type="number"
                placeholder="Number of days"
                value={requestedDays[tool.id] || ""}
                onChange={(e) => handleDaysChange(tool.id, e.target.value)}
                className="mt-2 p-2 w-full border rounded"
              />
              <input
                type="text"
                placeholder="Reason for request"
                value={reasons[tool.id] || ""}
                onChange={(e) => handleReasonChange(tool.id, e.target.value)}
                className="mt-2 p-2 w-full border rounded"
              />

              <button
                onClick={() => handleRequest(tool)}
                className="mt-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
              >
                Request Tool
              </button>
            </div>
          ))
        ) : (
          <p>No tools found.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableItems;
