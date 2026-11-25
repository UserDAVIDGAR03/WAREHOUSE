import React from 'react';
import { Package, Building2, AlertTriangle, ClipboardList, Plus } from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  counts,
}) {
  const navItems = [
    { id: 'products', label: 'Inventario general', icon: Package, count: counts.products },
    { id: 'suppliers', label: 'Proveedores', icon: Building2, count: counts.suppliers },
    { id: 'alerts', label: 'Stock crítico', icon: AlertTriangle, count: counts.lowStock, danger: true },
    { id: 'orders', label: 'Órdenes de salida', icon: ClipboardList, count: counts.orders },
  ];

  return (
    <aside className="w-full lg:w-76 shrink-0 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl lg:min-h-[calc(100vh-144px)]">
      <div>
        <div className="px-2 pb-3 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
          Navegación
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={19} strokeWidth={2.2} />
                  {item.label}
                </span>
                <span
                  className={`font-mono text-xs px-2.5 py-0.5 rounded-lg font-bold ${
                    item.danger && item.count > 0
                      ? 'bg-rose-500 text-white'
                      : active
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="px-2 pb-3 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
          Operación rápida
        </div>
        <button
          onClick={() => onSelectTab('add')}
          className={`w-full flex items-center justify-center gap-2.5 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
            activeTab === 'add'
              ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          <Plus size={19} strokeWidth={2.5} />
          Nuevo producto
        </button>
      </div>
    </aside>
  );
}