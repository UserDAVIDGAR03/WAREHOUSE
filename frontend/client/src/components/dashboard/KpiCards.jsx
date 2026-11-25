import React from 'react';
import { Package, Boxes, DollarSign, TrendingUp } from 'lucide-react';

export default function KpiCards({ products, lowStockCount }) {
  const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.unitPrice * p.stockQuantity, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-lg flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SKUs Activos</p>
          <p className="text-3xl font-extrabold font-mono text-white mt-2">{products.length}</p>
          <span className="text-xs text-cyan-400 mt-1.5 block font-medium">Productos registrados</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Package size={24} />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-lg flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades Totales</p>
          <p className="text-3xl font-extrabold font-mono text-white mt-2">{totalUnits.toLocaleString()}</p>
          <span className="text-xs text-slate-400 mt-1.5 block font-medium">Existencia física global</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Boxes size={24} />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-lg flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Inventario</p>
          <p className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
            ${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 mt-1.5 block font-medium">Valuación a costo unitario</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-lg flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Crítico</p>
          <p className={`text-3xl font-extrabold font-mono mt-2 ${lowStockCount > 0 ? 'text-rose-400' : 'text-white'}`}>
            {lowStockCount}
          </p>
          <span className="text-xs text-slate-400 mt-1.5 block font-medium">Requieren reabastecimiento</span>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
            lowStockCount > 0
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <TrendingUp size={24} />
        </div>
      </div>
    </div>
  );
}