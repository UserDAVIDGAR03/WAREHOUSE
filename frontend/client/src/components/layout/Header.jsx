import React from 'react';
import { LogOut } from 'lucide-react';

export default function Header({ onLogout }) {
  return (
    <header className="h-16 bg-zinc-950/95 border-b border-zinc-800/90 px-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-sm shadow-sm">
          W
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm sm:text-base text-white tracking-tight">
            Warehouse OS
          </span>
          <span className="hidden sm:inline-block text-zinc-700">/</span>
          <span className="hidden sm:inline text-xs font-mono text-zinc-400">
            INVENTORY SUITE
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
      >
        <LogOut size={14} />
        <span>Cerrar sesión</span>
      </button>
    </header>
  );
}