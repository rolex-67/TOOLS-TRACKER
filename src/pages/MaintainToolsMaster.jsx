import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MaintainToolsMaster = () => {
  const navigate = useNavigate();
  const [isToolskeeper, setIsToolskeeper] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.role !== 'Toolskeeper') {
      alert('❌ Access denied. This section is only accessible to Toolskeeper.');
      navigate('/'); // redirect to home or login
    } else {
      setIsToolskeeper(true);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 📝 Add your backend API call here to save tool if needed

    alert('✅ Tool submitted successfully');
    navigate('/stores'); // redirect after submission
  };

  if (!isToolskeeper) {
    return <div className="p-4 text-red-600 font-bold">Access Denied: Toolskeeper only</div>;
  }

  return (
    <div className="page p-4">
      <h2 className="text-2xl font-bold mb-4">Maintain Tools Master</h2>
      <form className="form space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Tool Name:</label>
          <input type="text" required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-1">Quantity Received:</label>
          <input type="number" required className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default MaintainToolsMaster;
