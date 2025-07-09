import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <nav className="bg-red-800 text-white px-4 py-4 flex flex-wrap justify-between items-center shadow-md">
      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
        <img src="/hindalco_logo.jpg" alt="Logo" className="h-10 w-10 border border-white rounded-full" />
        <span className="font-bold text-lg">Tools Tracker</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-6 items-center w-full sm:w-auto space-y-2 sm:space-y-0">
        {[
          { path: '/', name: 'Home' },
          { path: '/stores', name: 'Stores' },
          { path: '/available', name: 'Available Items' },
          { path: '/login', name: 'Login/SignUp' }
        ].map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            className="relative hover:text-gray-300 transition duration-300"
          >
            {link.name}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}

        {user && (
          <span className="text-xs sm:text-sm bg-white text-red-800 px-3 py-1 rounded-full font-semibold transition duration-300 whitespace-nowrap">
            {user.email} | <span className="capitalize">{user.role}</span>
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
