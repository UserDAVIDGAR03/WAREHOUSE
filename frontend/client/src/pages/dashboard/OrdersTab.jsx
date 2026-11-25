import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import NewOrderModal from '../../components/dashboard/NewOrderModal';

export default function OrdersTab({ orders = [], products = [], onCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

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
                <th className="py-3 px-4">Artículos</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-6 text-right">Monto total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-zinc-400 text-sm">
                    No hay órdenes de salida registradas.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const items = o.items || o.Items || [];
                  const isExpanded = expandedOrderId === o.id;
                  const totalUnits = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

                  return (
                    <React.Fragment key={o.id}>
                      <tr
                        onClick={() => toggleOrderRow(o.id)}
                        className="hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-6 font-mono text-xs font-semibold text-zinc-200">
                          <span className="inline-flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown size={14} className="text-zinc-400" />
                            ) : (
                              <ChevronRight size={14} className="text-zinc-400" />
                            )}
                            <span>{o.orderNumber}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 text-xs">
                          {new Date(o.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 text-xs font-mono">
                          {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'} ({items.length})
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {o.status || 'Completada'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono text-xs font-semibold text-white">
                          ${Number(o.totalAmount || 0).toFixed(2)}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-zinc-950/80">
                          <td colSpan="5" className="px-6 py-4">
                            {items.length === 0 ? (
                              <p className="text-xs text-zinc-500">
                                Sin detalle de artículos disponible para esta orden.
                              </p>
                            ) : (
                              <div className="rounded-lg border border-zinc-800 overflow-hidden">
                                <table className="w-full text-left text-xs">
                                  <thead>
                                    <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                                      <th className="py-2 px-4">SKU</th>
                                      <th className="py-2 px-4">Producto</th>
                                      <th className="py-2 px-4 text-right">Cantidad</th>
                                      <th className="py-2 px-4 text-right">Precio unit.</th>
                                      <th className="py-2 px-4 text-right">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-800/70">
                                    {items.map((item, idx) => {
                                      const prod = item.product || item.Product;
                                      const qty = item.quantity || 0;
                                      const unitPrice = item.unitPrice ?? prod?.unitPrice ?? 0;
                                      return (
                                        <tr key={item.id ?? idx} className="text-zinc-200">
                                          <td className="py-2 px-4 font-mono text-zinc-400">
                                            {prod?.sku || `#${item.productId}`}
                                          </td>
                                          <td className="py-2 px-4 font-medium text-white">
                                            {prod?.name || 'Producto'}
                                          </td>
                                          <td className="py-2 px-4 text-right font-mono">
                                            {qty}
                                          </td>
                                          <td className="py-2 px-4 text-right font-mono text-zinc-300">
                                            ${Number(unitPrice).toFixed(2)}
                                          </td>
                                          <td className="py-2 px-4 text-right font-mono font-semibold text-emerald-400">
                                            ${(Number(unitPrice) * qty).toFixed(2)}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
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