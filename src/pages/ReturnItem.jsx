import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReturnItem = () => {
  const [returns, setReturns] = useState([]);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "User") {
      alert("❌ Only Users can view return items. Please login.");
      navigate("/login");
      return;
    }

    const fetchReturns = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/returns/${user.email}`
        );
        setReturns(res.data);
      } catch (err) {
        console.error("❌ Error fetching return items:", err);
      }
    };

    fetchReturns();
  }, [navigate]);

const handleConfirmReturn = async (toolId) => {
  const { condition, actualReturnDate } = inputs[toolId] || {};
  try {
    const res = await axios.put(`http://localhost:5000/api/returns/${toolId}/confirm`, {
      condition,
      actualReturnDate,
    });
    alert("✅ Tool return confirmed");

    // 🔄 Re-fetch returns to update UI
    const user = JSON.parse(localStorage.getItem("user"));
    const updated = await axios.get(`http://localhost:5000/api/returns/${user.email}`);
    setReturns(updated.data);

  } catch (err) {
    console.error(err);
    alert("❌ Failed to confirm return");
  }
};




  const handleInputChange = (toolId, field, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [toolId]: {
        ...prevInputs[toolId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Issued Tools</h2>
      {returns.length === 0 ? (
        <p>You have no issued tools currently.</p>
      ) : (
        <ul className="space-y-4">
          {returns
            .filter(
              (r) => r.userId === JSON.parse(localStorage.getItem("user")).email
            )
            .map((r) => {
              const appointedDate = new Date(r.appointedAt);
              const dueDate = new Date(appointedDate);
              dueDate.setDate(appointedDate.getDate() + (r.requestedDays || 0));

              return (
                <li
                  key={r._id}
                  className="bg-gray-200 dark:bg-gray-700 p-4 rounded"
                >
                  <strong>{r.toolName}</strong> issued on{" "}
                  {appointedDate.toLocaleDateString()}.
                  <br />
                  Return by: {dueDate.toLocaleDateString()} ({r.requestedDays} days)
                  <br />
                  Reason: {r.reason || "N/A"}
                  <br />
                  <input
                    type="text"
                    placeholder="Condition (e.g. Good, Damaged)"
                    value={inputs[r._id]?.condition || ""}
                    onChange={(e) =>
                      handleInputChange(r._id, "condition", e.target.value)
                    }
                    className="mt-2 p-2 rounded border border-gray-300 w-full"
                  />
                  <input
                    type="date"
                    placeholder="Actual Return Date"
                    value={inputs[r._id]?.actualReturnDate || ""}
                    onChange={(e) =>
                      handleInputChange(r._id, "actualReturnDate", e.target.value)
                    }
                    className="mt-2 p-2 rounded border border-gray-300 w-full"
                  />
                  <button
                    onClick={() => handleConfirmReturn(r._id)}
                    className="bg-green-700 text-white px-3 py-1 rounded mt-2"
                  >
                    Confirm Return
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default ReturnItem;
