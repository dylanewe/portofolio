import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true, style }) => {
  return (
    <div
      className={`glass-card ${hover ? '' : 'hover:transform-none hover:border-[rgba(0,212,255,0.15)] hover:shadow-[0_4px_30px_rgba(0,212,255,0.08)]'} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
