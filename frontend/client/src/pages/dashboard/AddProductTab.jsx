import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { warehouseService } from '../../api/warehouseApi';

export default function AddProductTab({ suppliers, onCreated, onCancel }) {
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    description: '',
    unitPrice: '',
    stockQuantity: '',
    minimumStockAlert: 5,
    supplierId: suppliers[0]?.id || 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Guardando producto...');
    try {
      const payload = {
        ...newProduct,
        unitPrice: parseFloat(newProduct.unitPrice) || 0,
        stockQuantity: parseInt(newProduct.stockQuantity) || 0,
        minimumStockAlert: parseInt(newProduct.minimumStockAlert) || 5,
        supplierId: parseInt(newProduct.supplierId) || 1,
      };

      await warehouseService.createProduct(payload);
      toast.success('¡Producto registrado exitosamente!', { id: loadToast });
      onCreated();
    } catch (err) {
      toast.error('Error al registrar: ' + (err.response?.data?.message || err.message), { id: loadToast });
    }
  };

  return (
    <div className="max-w-3xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl p-8 lg:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-white">Registrar nuevo producto</h2>
        <p className="text-sm text-slate-400 mt-1">
          Completa la ficha técnica del artículo para integrarlo al catálogo activo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              SKU (Código único)
            </label>
            <input
              type="text"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Ej. SKU-9920"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              Proveedor asignado
            </label>
            <select
              value={newProduct.supplierId}
              onChange={(e) => setNewProduct({ ...newProduct, supplierId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              required
            >
              {suppliers.length === 0 && <option value={1}>Proveedor por defecto (ID: 1)</option>}
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-950 text-white">
                  {s.name} (ID: {s.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
            Nombre del artículo
          </label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Ej. Tarima industrial reforzada"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
            Descripción técnica
          </label>
          <textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 h-24 resize-none"
            placeholder="Dimensiones, material, pasillo o notas de almacenamiento..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              Precio unitario ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={newProduct.unitPrice}
              onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              Stock inicial
            </label>
            <input
              type="number"
              value={newProduct.stockQuantity}
              onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              Alerta stock mínimo
            </label>
            <input
              type="number"
              value={newProduct.minimumStockAlert}
              onChange={(e) => setNewProduct({ ...newProduct, minimumStockAlert: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="5"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-base"
          >
            Guardar producto en inventario
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}