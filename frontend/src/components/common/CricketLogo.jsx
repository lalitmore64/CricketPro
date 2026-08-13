import React from 'react';

const CricketLogo = ({ size = 22, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Sleek Minimalist Cricket Bat */}
      <path d="M14.5 4.5L19.5 9.5L9 20L4 15L14.5 4.5Z" />
      <path d="M17 7L20.5 3.5" />
      {/* Cricket Ball */}
      <circle cx="6" cy="6" r="2.5" fill={color} stroke="none" />
    </svg>
  );
};

export default CricketLogo;
