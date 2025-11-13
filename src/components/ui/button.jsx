import React from 'react';

export function Button({ children, className = '', variant = 'default', size = 'md', asChild = false, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-black text-white border-transparent hover:opacity-90',
    outline: 'bg-transparent text-black border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-black border-transparent hover:bg-gray-100',
    secondary: 'bg-gray-800 text-white border-transparent hover:opacity-90'
  };
  const sizes = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4',
    lg: 'h-11 px-6'
  };
  const cls = [base, variants[variant] || variants.default, sizes[size] || sizes.md, className]
    .filter(Boolean)
    .join(' ');

  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp className={cls} {...props}>
      {children}
    </Comp>
  );
}

