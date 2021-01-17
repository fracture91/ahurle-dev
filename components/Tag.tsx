import React from 'react';

export const Tag: React.FC<{ tag: string }> = ({ tag }) => {
  return (
    <div className="tag">{tag}</div>
  );
};
