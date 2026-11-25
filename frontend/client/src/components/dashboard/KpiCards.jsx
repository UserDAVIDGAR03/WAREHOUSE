import React from 'react';
import { Package, Boxes, DollarSign, AlertCircle } from 'lucide-react';

export default function KpiCards({ products, lowStockCount }) {
  const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.unitPrice * p.stockQuantity, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 transition-colors p-4 sm:p-5 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">SKUs activos</span>
          <div className="p-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300">
            <Package size={15} />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white tracking-tight">
          {products.length}
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-800/70 text-[11px] text-zinc-500">
          Artículos registrados en catálogo
        </div>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 transition-colors p-4 sm:p-5 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Unidades totales</span>
          <div className="p-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300">
            <Boxes size={15} />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white tracking-tight">
          {totalUnits.toLocaleString()}
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-800/70 text-[11px] text-zinc-500">
          Existencia física acumulada
        </div>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 transition-colors p-4 sm:p-5 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Valor del inventario</span>
          <div className="p-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-emerald-400">
            <DollarSign size={15} />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
          ${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-800/70 text-[11px] text-zinc-500">
          Valuación por costo unitario
        </div>
      </div>

      <div
        className={`bg-zinc-900/90 border transition-colors p-4 sm:p-5 rounded-xl ${
          lowStockCount > 0
            ? 'border-rose-500/30 hover:border-rose-500/50'
            : 'border-zinc-800 hover:border-zinc-700/80'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Stock crítico</span>
          <div
            className={`p-1.5 rounded-md border ${
              lowStockCount > 0
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400'
            }`}
          >
            <AlertCircle size={15} />
          </div>
        </div>
        <div
          className={`text-2xl font-bold font-mono tracking-tight ${
            lowStockCount > 0 ? 'text-rose-400' : 'text-white'
          }`}
        >
          {lowStockCount}
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-800/70 text-[11px] text-zinc-500">
          {lowStockCount > 0 ? 'Requieren atención inmediata' : 'Niveles dentro de rango'}
        </div>
      </div>
    </div>
  );
}