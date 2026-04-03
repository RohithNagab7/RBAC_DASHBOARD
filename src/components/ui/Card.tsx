import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`glass-card border border-white/5 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30 group ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`mb-6 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => {
  return <h2 className={`text-2xl font-bold text-white ${className}`}>{children}</h2>;
};

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};
