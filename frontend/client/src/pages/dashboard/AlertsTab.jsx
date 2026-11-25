import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlertsTab({ lowStock }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-slate-800">
        <h2 className="text-xl font-extrabold text-rose-400 flex items-center gap-2.5">
          <AlertTriangle size={22} />
          Monitoreo de stock crítico
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Artículos cuya existencia está igual o por debajo del mínimo configurado.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60 uppercase tracking-wider text-xs">
              <th className="py-4 px-8">SKU</th>
              <th className="py-4 px-5">Producto</th>
              <th className="py-4 px-5 text-right">Stock actual</th>
              <th className="py-4 px-8 text-right">Mínimo requerido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {lowStock.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-3" />
                  <p className="text-white font-bold text-base">Sin alertas de desabasto</p>
                  <p className="text-slate-400 text-xs mt-1">Todos los productos superan su umbral mínimo.</p>
                </td>
              </tr>
            ) : (
              lowStock.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-8 font-mono font-bold text-slate-300">{p.sku}</td>
                  <td className="py-5 px-5 font-bold text-white">{p.name}</td>
                  <td className="py-5 px-5 text-right font-mono font-extrabold text-rose-400">
                    {p.stockQuantity} unids.
                  </td>
                  <td className="py-5 px-8 text-right font-mono text-slate-400">
                    {p.minimumStockAlert} unids.
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}