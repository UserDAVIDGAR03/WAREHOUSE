import React, { useState } from 'react';
import { Package, Download, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportProductsToCSV } from '../../utils/exportCsv.js';

export default function ProductsTab({ products, loading, onAddClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Inventario general</h2>
          <p className="text-sm text-slate-400 mt-1">Consulta existencias, precios y proveedores en tiempo real.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por SKU o producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => exportProductsToCSV(products)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-950 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={onAddClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-500/20"
            >
              <Plus size={17} strokeWidth={2.5} />
              Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60 uppercase tracking-wider text-xs">
              <th className="py-4 px-8">SKU</th>
              <th className="py-4 px-5">Producto</th>
              <th className="py-4 px-5">Proveedor</th>
              <th className="py-4 px-5 text-right">Precio unitario</th>
              <th className="py-4 px-8 text-right">Stock disponible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-5 px-8"><div className="h-5 bg-slate-800 rounded w-24"></div></td>
                  <td className="py-5 px-5"><div className="h-5 bg-slate-800 rounded w-52"></div></td>
                  <td className="py-5 px-5"><div className="h-5 bg-slate-800 rounded w-36"></div></td>
                  <td className="py-5 px-5 text-right"><div className="h-5 bg-slate-800 rounded w-20 ml-auto"></div></td>
                  <td className="py-5 px-8 text-right"><div className="h-6 bg-slate-800 rounded w-24 ml-auto"></div></td>
                </tr>
              ))
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <Package size={40} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-slate-400 font-semibold text-base">No se encontraron productos</p>
                  <p className="text-slate-500 text-xs mt-1">Intenta con otro término de búsqueda o registra un artículo nuevo.</p>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => {
                const isLow = p.stockQuantity <= p.minimumStockAlert;
                const fillPct = Math.min(100, Math.round((p.stockQuantity / Math.max(p.minimumStockAlert * 3, 1)) * 100));
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-5 px-8">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {p.sku}
                      </span>
                    </td>
                    <td className="py-5 px-5">
                      <div className="font-bold text-white">{p.name}</div>
                      {p.description && (
                        <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">{p.description}</div>
                      )}
                    </td>
                    <td className="py-5 px-5 text-slate-300 font-medium">
                      {p.supplier?.name || `Proveedor #${p.supplierId}`}
                    </td>
                    <td className="py-5 px-5 text-right font-mono font-semibold text-slate-200">
                      ${p.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="inline-flex flex-col items-end gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                            isLow
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          }`}
                        >
                          {p.stockQuantity} unids.
                        </span>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
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

      <div className="p-5 px-8 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400 bg-slate-950/40">
        <span>
          Página <strong className="text-white">{currentPage}</strong> de{' '}
          <strong className="text-white">{totalPages}</strong> ({filteredProducts.length} registros)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 border border-slate-800 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2.5 border border-slate-800 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}