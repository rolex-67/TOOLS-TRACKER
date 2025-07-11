import React, { useEffect, useState } from "react";
import axios from "axios";

const Stores = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products")
      .then((res) => setTools(res.data.products))
      .catch((err) => console.error("AXIOS ERROR:", err));
  }, []);

  const handleAppoint = async (tool) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Toolskeeper") {
      alert("❌ Only Toolskeeper can appoint tools.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/appoint", {
        toolId: tool.id,
        toolName: tool.title,
        quantity: 1,
        appointedBy: user.email,
      });
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      alert("❌ Failed to appoint tool.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Tools in Store</h2>
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
              <p className="text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
              <p className="font-bold mt-1">ID: {tool.id}</p>
              <p className="font-bold">Stock: {tool.stock}</p>
              <button
                onClick={() => handleAppoint(tool)}
                className="mt-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
              >
                Appoint
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

export default Stores;
