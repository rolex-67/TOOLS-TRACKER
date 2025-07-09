import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, desc, path }) => (
  <Link
    to={path}
    className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl hover:scale-105 transform transition duration-300 ease-in-out p-4 hover:bg-gradient-to-br hover:from-red-100 hover:to-red-200 dark:hover:from-gray-700 dark:hover:to-gray-600"
  >
    <h2 className="text-lg font-bold mb-2 text-red-700 dark:text-red-400">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300">{desc}</p>
  </Link>
);

export default Card;
