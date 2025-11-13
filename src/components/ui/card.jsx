import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={['rounded-lg border border-gray-200 bg-white', className].join(' ')}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={['p-4 border-b border-gray-100', className].join(' ')}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={['font-semibold text-lg', className].join(' ')}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={['p-4', className].join(' ')}>{children}</div>;
}

