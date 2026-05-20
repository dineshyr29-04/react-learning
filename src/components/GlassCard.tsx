import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  headerActions?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  title, 
  headerActions, 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`glass-panel rounded-xl overflow-hidden shadow-2xl flex flex-col h-full ${className}`}
      {...props}
    >
      {(title || headerActions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/30">
          {title && (
            <h3 className="text-sm font-semibold tracking-wide text-zinc-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {title}
            </h3>
          )}
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};
