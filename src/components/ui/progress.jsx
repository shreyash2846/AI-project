import React from 'react';

export function Progress({ value = 0, className = '' }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={['w-full bg-gray-200 rounded-full', className].join(' ')}>
      <div
        className="h-full bg-blue-600 rounded-full"
        style={{ width: `${clamped}%`, height: 8 }}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}

