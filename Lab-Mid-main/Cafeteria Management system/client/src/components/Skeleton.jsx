import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`}></div>
);

export default Skeleton;
