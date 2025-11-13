import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={[
        'w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      ].join(' ')}
      {...props}
    />
  );
}

