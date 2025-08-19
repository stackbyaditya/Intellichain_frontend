import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input className="border p-2 rounded-md" {...props} />;
};

export { Input };
