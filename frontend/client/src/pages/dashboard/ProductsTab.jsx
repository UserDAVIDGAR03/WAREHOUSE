import React, { useState } from 'react';
import { Package, Download, Plus, Search, ChevronLeft, ChevronRight, ArrowDownToLine } from 'lucide-react';
import { exportProductsToCSV } from '../../utils/exportCsv.js';
import StockEntryModal from '../../components/dashboard/StockEntryModal';

const STOCK_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'low', label: 'Stock crítico' },
  { id: 'out', label: 'Agotados' },
];

export default function ProductsTab({ products = [], loading, onAddClick, onCreated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const itemsPerPage = 8;

  const filteredProducts = products.filter((p) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(p.name || '').toLowerCase().includes(query) ||
      String(p.sku || '').toLowerCase().includes(query);

    if (!matchesQuery) return false;

    if (stockFilter === 'low') {
      return p.stockQuantity <= p.minimumStockAlert;
    }
    if (stockFilter === 'out') {
      return p.stockQuantity === 0;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-zinc-800 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Inventario general</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Consulta existencias, precios y proveedores en tiempo real.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
            <div className="inline-flex rounded-lg bg-zinc-950 border border-zinc-800 p-0.5 self-start sm:self-auto">
              {STOCK_FILTERS.map((f) => {
                const active = stockFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setStockFilter(f.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por SKU o producto..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg pl-9 pr-3.5 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => exportProductsToCSV(filteredProducts)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/70 text-zinc-200 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Download size={15} />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEntryModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/70 text-zinc-100 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowDownToLine size={15} />
                <span>Entrada de stock</span>
              </button>
              <button
                type="button"
                onClick={onAddClick}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={15} strokeWidth={2.2} />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-medium bg-zinc-950 text-xs">
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4 text-right">Precio unitario</th>
                <th className="py-3 px-6 text-right">Stock disponible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-zinc-800 rounded w-48"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-zinc-800 rounded w-16 ml-auto"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-5 bg-zinc-800 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <Package size={32} className="mx-auto text-zinc-700 mb-2.5" />
                    <p className="text-zinc-300 font-medium text-sm">No se encontraron productos</p>
                    <p className="text-zinc-500 text-xs mt-1">Intenta con otro filtro, búsqueda o registra un artículo nuevo.</p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isLow = p.stockQuantity <= p.minimumStockAlert;
                  const fillPct = Math.min(100, Math.round((p.stockQuantity / Math.max(p.minimumStockAlert * 3, 1)) * 100));
                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-zinc-950 text-zinc-200 border border-zinc-800">
                          {p.sku}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{p.name}</div>
                        {p.description && (
                          <div className="text-xs text-zinc-500 truncate max-w-xs mt-0.5">{p.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 text-xs">
                        {p.supplier?.name || `Proveedor #${p.supplierId}`}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs font-medium text-zinc-200">
                        ${p.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex flex-col items-end gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-mono font-semibold text-xs ${
                              isLow
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            }`}
                          >
                            {p.stockQuantity} unids.
                          </span>
                          <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-400'}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/60">
          <span>
            Página <strong className="text-white font-mono">{currentPage}</strong> de{' '}
            <strong className="text-white font-mono">{totalPages}</strong> ({filteredProducts.length} registros)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-zinc-800 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-zinc-800 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <StockEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        products={products}
        onCreated={onCreated}
      />
    </>
  );
}