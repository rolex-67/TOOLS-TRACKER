import React from 'react';
import Card from '../components/Card';

const Home = () => {
  const features = [
    { title: 'Appoint Item', desc: 'Request tools as per need', path: '/appoint' },
    { title: 'Return Item', desc: 'Return tools after job done', path: '/return' },
    { title: 'Missing Tool List', desc: 'Tools not returned on time', path: '/missing' },
    { title: 'Users Using Tools', desc: 'Current active tool users', path: '/users' },
    { title: 'Maintain Tools Master', desc: 'Manage tools inventory', path: '/tools-master' },
    { title: 'Maintain Users', desc: 'Add/update users', path: '/users-master' },
    { title: 'Approve Tool Requests', desc: 'Approve/reject requests', path: '/approve' },
    
    { title: 'Master Info Report', desc: 'All master data summary', path: '/master-report' },
    { title: 'Stock Report', desc: 'Available stock report', path: '/stock-report' }
    // { title: 'System Roles', desc: 'Assign roles to users', path: '/roles' },
    // { title: 'Password Security', desc: 'Change user password', path: '/password' },
  ];

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-50 dark:bg-gray-900">
      {features.map((feature, idx) => (
        <Card key={idx} {...feature} />
      ))}
    </main>
  );
};

export default Home;
