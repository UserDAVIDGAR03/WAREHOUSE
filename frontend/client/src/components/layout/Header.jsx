import React from 'react';
import { LogOut } from 'lucide-react';

export default function Header({ onLogout }) {
  return (
    <header className="h-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 lg:px-10 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-cyan-500/20">
          W
        </div>
        <div>
          <span className="font-extrabold text-lg text-white tracking-tight block leading-none">
            Warehouse OS
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Enterprise Inventory Suite</span>
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PostgreSQL Conectado</span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-rose-400 hover:text-white font-semibold transition-all px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}