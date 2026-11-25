import React, { useState } from 'react';
import { PackagePlus, ScanBarcode, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { warehouseService } from '../../api/warehouseApi';
import BarcodeScannerModal from './BarcodeScannerModal';

export default function AddProductTab({ suppliers = [], onProductCreated }) {
  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    description: '',
    unitPrice: '',
    stockQuantity: '',
    minimumStockAlert: '5',
    supplierId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScanSuccess = (decodedText) => {
    setFormData((prev) => ({ ...prev, barcode: decodedText.trim() }));
    setScannerOpen(false);
    toast.success(`Código escaneado: ${decodedText.trim()}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sku.trim() || !formData.name.trim() || !formData.supplierId) {
      toast.error('Completa SKU, nombre y proveedor.');
      return;
    }

    setSubmitting(true);
    try {
      await warehouseService.createProduct({
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || null,
        name: formData.name.trim(),
        description: formData.description.trim(),
        unitPrice: parseFloat(formData.unitPrice) || 0,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        minimumStockAlert: parseInt(formData.minimumStockAlert, 10) || 5,
        supplierId: parseInt(formData.supplierId, 10)
      });

      toast.success('Producto registrado en el inventario');
      setFormData({
        sku: '',
        barcode: '',
        name: '',
        description: '',
        unitPrice: '',
        stockQuantity: '',
        minimumStockAlert: '5',
        supplierId: ''
      });
      if (onProductCreated) await onProductCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo registrar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Registrar Nuevo Producto</h2>
            <p className="text-xs text-zinc-400">
              Asigna un SKU interno y opcionalmente un código de barras comercial para entradas y salidas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU Interno */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                SKU Interno <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Ej. LAP-DELL-001"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Código de Barras */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Código de Barras (EAN / UPC)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder="Escanea o escribe el código"
                  className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setScannerOpen(true)}
                  title="Escanear código de barras con cámara"
                  className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <ScanBarcode className="w-4 h-4 text-emerald-400" />
                  Escanear
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Nombre del Producto <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Monitor Dell 24 pulgadas"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Proveedor */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Proveedor <span className="text-rose-400">*</span>
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Selecciona un proveedor...</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Descripción
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Especificaciones o notas del artículo..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Precio Unitario */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Precio Unitario ($) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Stock Inicial */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Stock Inicial <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Alerta Stock Mínimo */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Stock Mínimo (Alerta)
              </label>
              <input
                type="number"
                min="0"
                name="minimumStockAlert"
                value={formData.minimumStockAlert}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>

      {scannerOpen && (
        <BarcodeScannerModal
          onScanSuccess={handleScanSuccess}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
}