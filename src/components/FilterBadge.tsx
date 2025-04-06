import React from 'react';

interface FilterBadgeProps {
  active: boolean;
  onClick: () => void;
  className: string;
  icon: string;
  text: string;
}

export default function FilterBadge({ 
  active, 
  onClick, 
  className, 
  icon, 
  text 
}: FilterBadgeProps): JSX.Element {
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`badge ${className} p-2 filter-badge border-0 ${active ? 'filter-active' : 'filter-inactive'}`}
      style={{ cursor: 'pointer', opacity: active ? 1 : 0.6 }}
    >
      <i className={`bi bi-${icon} me-1`}></i> {text}
    </button>
  );
} 