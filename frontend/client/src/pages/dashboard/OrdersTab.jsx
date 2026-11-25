import React from 'react';

export default function OrdersTab({ orders }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-slate-800">
        <h2 className="text-xl font-extrabold text-white">Historial de órdenes de salida</h2>
        <p className="text-sm text-slate-400 mt-1">Registro transaccional de movimientos logísticos.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60 uppercase tracking-wider text-xs">
              <th className="py-4 px-8">Folio</th>
              <th className="py-4 px-5">Fecha y hora</th>
              <th className="py-4 px-5">Estado</th>
              <th className="py-4 px-8 text-right">Monto total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-20 text-center text-slate-400 font-medium">
                  No hay órdenes de salida registradas.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-8 font-mono font-bold text-cyan-400">{o.orderNumber}</td>
                  <td className="py-5 px-5 text-slate-300">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="py-5 px-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {o.status || 'Completada'}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right font-mono font-extrabold text-white">
                    ${o.totalAmount.toFixed(2)}
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