import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NewOrderModal from '../../components/dashboard/NewOrderModal';

export default function OrdersTab({ orders = [], products = [], onCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Historial de órdenes de salida</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Registro transaccional de movimientos logísticos.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.2} />
            <span>Nueva orden de salida</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-medium bg-zinc-950 text-xs">
                <th className="py-3 px-6">Folio</th>
                <th className="py-3 px-4">Fecha y hora</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-6 text-right">Monto total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center text-zinc-400 text-sm">
                    No hay órdenes de salida registradas.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-semibold text-zinc-200">{o.orderNumber}</td>
                    <td className="py-3.5 px-4 text-zinc-300 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {o.status || 'Completada'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-xs font-semibold text-white">
                      ${o.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        onCreated={onCreated}
      />
    </>
  );
}