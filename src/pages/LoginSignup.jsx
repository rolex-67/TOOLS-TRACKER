import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('User');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && password !== confirm)) {
      setMessage('❌ Please fill all fields correctly.');
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/auth/login', { email, password });
        setMessage(`✅ ${res.data.message}`);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const userRole = res.data.user.role;
        if (userRole === 'User') navigate('/available');
        else if (userRole === 'Toolskeeper') navigate('/appoint');
        else if (userRole === 'Admin') navigate('/approve');

      } else {
        const res = await axios.post('http://localhost:5000/auth/signup', { email, password, role });
        setMessage(`✅ ${res.data.message}`);
      }

      setEmail('');
      setPassword('');
      setConfirm('');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.message || 'Operation failed.'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        {isLogin ? 'Login' : 'Signup'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="p-2 rounded border border-gray-300 dark:bg-gray-700" />

        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="p-2 rounded border border-gray-300 dark:bg-gray-700" />

        {!isLogin && (
          <>
            <label>Confirm Password:</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="p-2 rounded border border-gray-300 dark:bg-gray-700" />

            <label>Role:</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="p-2 rounded border border-gray-300 dark:bg-gray-700">
              <option>User</option>
              <option>Admin</option>
              <option>Toolskeeper</option>
            </select>
          </>
        )}

        <button type="submit" className="bg-red-700 hover:bg-red-800 text-white rounded p-2 transition">{isLogin ? 'Login' : 'Signup'}</button>
        {message && <p className="font-bold">{message}</p>}
      </form>

      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-red-700 hover:underline">
          {isLogin ? 'Signup' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default LoginSignup;
