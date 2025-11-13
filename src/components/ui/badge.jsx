import React from 'react';

export function Badge({ children, className = '', variant = 'default', ...props }) {
  const base = 'inline-flex items-center rounded-full border px-2 py-0.5 text-xs';
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return (
    <span className={[base, variants[variant] || variants.default, className].join(' ')} {...props}>
      {children}
    </span>
  );
}

