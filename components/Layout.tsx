
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onVersionClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onVersionClick }) => {
  return (
    <div className="h-full flex flex-col items-center px-4 py-6 md:p-12 max-w-4xl mx-auto relative z-10 overflow-hidden">
      <header className="w-full mb-6 md:mb-10 flex flex-col items-center flex-shrink-0">
        <h1 className="text-4xl md:text-6xl font-black font-accent tracking-tighter text-white mb-1">HMBTI</h1>
        <p className="text-[8px] text-neutral-500 uppercase tracking-[0.4em] font-medium text-center">Heavy Music Beholder Type Indicator</p>
      </header>
      
      <main className="w-full flex-grow flex flex-col overflow-hidden relative">
        {children}
      </main>

      <footer className="w-full mt-6 py-4 border-t border-neutral-900/50 flex flex-col items-center space-y-1 opacity-60 flex-shrink-0">
        <p 
          onClick={onVersionClick}
          className="text-[8px] font-accent uppercase tracking-[0.3em] text-neutral-400 cursor-default active:text-white transition-colors"
        >
          System Protocol V1.05
        </p>
      </footer>
    </div>
  );
};
