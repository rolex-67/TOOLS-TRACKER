import React from 'react';
import { useNavigate } from 'react-router-dom';

const MaintainToolsMaster = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 📝 Add your backend API call here to save tool if needed

    alert('✅ Tool submitted successfully');

    // 🔀 Redirect to Stores page
    navigate('/stores');
  };

  return (
    <div className="page">
      <h2>Maintain Tools Master</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Tool Name:</label>
        <input type="text" required />

        <label>Quantity Received:</label>
        <input type="number" required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MaintainToolsMaster;
