import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaintainUsers = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.role !== 'Admin') {
      alert('❌ Access denied. This section is only accessible to Admin.');
      setIsAdmin(false);
      return;
    } else {
      setIsAdmin(true);
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load users');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/signup', { email, password, role });
      alert('✅ User added successfully');
      setEmail('');
      setPassword('');
      setRole('');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/auth/delete/${email}`);
      alert('✅ User deleted');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (email) => {
    const newPass = prompt('Enter new password:');
    if (!newPass) return;
    try {
      await axios.put('/auth/change-password', { email, password: newPass });
      alert('✅ Password changed');
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) {
    return <div className="p-4 text-red-600 font-bold">Access Denied: Admins only</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Maintain Users</h2>

      <form onSubmit={handleAddUser} className="space-y-4 mb-10">
        <input type="text" placeholder="User Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select Role</option>
          <option>Admin</option>
          <option>Approver</option>
          <option>Maintenance User</option>
          <option>Storekeeper</option>
        </select>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Add User</button>
      </form>

      <h3 className="text-xl font-semibold mb-2">All Users</h3>
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u._id} className="border p-2 rounded">
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Role:</strong> {u.role}</p>
            <button onClick={() => handleChangePassword(u.email)} className="bg-green-700 text-white px-2 py-1 rounded mr-2">Change Password</button>
            {u.role !== 'Admin' && (
              <button onClick={() => handleDeleteUser(u.email)} className="bg-red-700 text-white px-2 py-1 rounded">Delete User</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintainUsers;
