import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlertsTab({ products = [] }) {
  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.minimumStockAlert);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-5 lg:p-6 border-b border-zinc-800 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Alertas de stock crítico</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Artículos que alcanzaron o cayeron por debajo de su umbral mínimo configurado.
          </p>
        </div>
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/25 font-semibold">
          {lowStockProducts.length} críticos
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-medium bg-zinc-950 text-xs">
              <th className="py-3 px-6">SKU</th>
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4 text-right">Stock actual</th>
              <th className="py-3 px-4 text-right">Mínimo requerido</th>
              <th className="py-3 px-6 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {lowStockProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-16 text-center">
                  <CheckCircle2 size={30} className="mx-auto text-emerald-400 mb-2" />
                  <p className="text-zinc-200 font-medium text-sm">Sin alertas activas</p>
                  <p className="text-zinc-500 text-xs mt-1">Todos los productos mantienen existencias por encima del mínimo.</p>
                </td>
              </tr>
            ) : (
              lowStockProducts.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-xs text-zinc-200">{p.sku}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{p.name}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-rose-400">
                    {p.stockQuantity} unids.
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-zinc-400">
                    {p.minimumStockAlert} unids.
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/25">
                      <AlertTriangle size={12} />
                      Reponer
                    </span>
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