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
    <div className="max-w-3xl bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 lg:p-8">
      <div className="mb-6 pb-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white tracking-tight">Registrar nuevo producto</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Completa la ficha técnica del artículo para integrarlo al catálogo activo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              SKU (Código único)
            </label>
            <input
              type="text"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="Ej. SKU-9920"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Proveedor asignado
            </label>
            <select
              value={newProduct.supplierId}
              onChange={(e) => setNewProduct({ ...newProduct, supplierId: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              required
            >
              {suppliers.length === 0 && <option value={1}>Proveedor por defecto (ID: 1)</option>}
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="bg-zinc-950 text-white">
                  {s.name} (ID: {s.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Nombre del artículo
          </label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            placeholder="Ej. Tarima industrial reforzada"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Descripción técnica
          </label>
          <textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all h-20 resize-none"
            placeholder="Dimensiones, material, pasillo o notas de almacenamiento..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Precio unitario ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={newProduct.unitPrice}
              onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Stock inicial
            </label>
            <input
              type="number"
              value={newProduct.stockQuantity}
              onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Alerta stock mínimo
            </label>
            <input
              type="number"
              value={newProduct.minimumStockAlert}
              onChange={(e) => setNewProduct({ ...newProduct, minimumStockAlert: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="5"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            type="submit"
            className="flex-1 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Guardar producto en inventario
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-800/70 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}