import React from 'react';

export function Alert({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'border-gray-300 bg-white',
    destructive: 'border-red-300 bg-red-50 text-red-800'
  };

  return (
    <div
      className={['rounded-md border px-4 py-3 text-sm', variants[variant] || variants.default, className]
        .filter(Boolean)
        .join(' ')}
      role="alert"
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <p>{children}</p>;
}

