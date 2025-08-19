import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-100 text-center text-gray-600 text-sm mt-8">
      <p>&copy; {new Date().getFullYear()} Intellichain. All rights reserved.</p>
    </footer>
  );
};

export { Footer };
