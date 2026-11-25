import React from 'react';
import { Package, Building2, AlertTriangle, ClipboardList, Plus, ChevronRight } from 'lucide-react';

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
    <aside className="w-full lg:w-64 shrink-0 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between lg:sticky lg:top-22">
      <div>
        <div className="px-2.5 pb-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
          Módulos del sistema
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer group ${
                  active
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className={active ? 'text-zinc-950' : 'text-zinc-500 group-hover:text-zinc-300'}
                  />
                  <span className="truncate">{item.label}</span>
                </span>

                <span className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded-md ${
                      item.danger && item.count > 0
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold'
                        : active
                        ? 'bg-zinc-950/10 text-zinc-950 font-semibold'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    {item.count}
                  </span>
                  {active && <ChevronRight size={14} className="text-zinc-950" />}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800/90">
        <button
          type="button"
          onClick={() => onSelectTab('add')}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'add'
              ? 'bg-white text-zinc-950'
              : 'bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white'
          }`}
        >
          <Plus size={15} strokeWidth={2.2} />
          <span>Registrar producto</span>
        </button>

        <div className="mt-3 px-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>ENTORNO</span>
          <span className="text-zinc-400">LOCAL // v2.0</span>
        </div>
      </div>
    </aside>
  );
}