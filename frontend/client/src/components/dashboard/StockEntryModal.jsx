import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, ScanBarcode, Camera } from 'lucide-react';
import { warehouseService } from '../../api/warehouseApi';
import BarcodeScannerModal from '../../pages/dashboard/BarcodeScannerModal';

export default function StockEntryModal({ isOpen, onClose, products = [], onCreated }) {
  const defaultProductId = products[0]?.id || '';

  const [reference, setReference] = useState('');
  const [items, setItems] = useState([
    { productId: defaultProductId, quantity: 1 },
  ]);
  const [scanInput, setScanInput] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scanInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scanInputRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getProductById = (id) => products.find((p) => p.id === Number(id));

  const handleScanCode = (rawCode) => {
    const code = (rawCode || '').trim().toLowerCase();
    if (!code) return;

    const matched = products.find(
      (p) => String(p.sku || '').trim().toLowerCase() === code
    );

    if (!matched) {
      toast.error(`No se encontró ningún producto con código/SKU "${rawCode.trim()}".`);
      setScanInput('');
      scanInputRef.current?.focus();
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((r) => Number(r.productId) === matched.id);
      if (existingIndex !== -1) {
        const currentQty = Number(prev[existingIndex].quantity) || 0;
        toast.success(`+1 entrada para ${matched.name} (${currentQty + 1} unids.)`);
        return prev.map((r, idx) =>
          idx === existingIndex ? { ...r, quantity: currentQty + 1 } : r
        );
      }

      toast.success(`Agregado a entrada: ${matched.name}`);
      if (prev.length === 1 && !prev[0].productId) {
        return [{ productId: matched.id, quantity: 1 }];
      }
      return [...prev, { productId: matched.id, quantity: 1 }];
    });

    setScanInput('');
    scanInputRef.current?.focus();
  };

  const handleScanKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScanCode(scanInput);
    }
  };

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      { productId: defaultProductId, quantity: 1 },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeRow = (index, field, value) => {
    setItems((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: field === 'productId' ? Number(value) : Math.max(1, Number(value) || 1),
            }
          : row
      )
    );
  };

  const totalUnits = items.reduce((acc, row) => acc + (Number(row.quantity) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validItems = items
      .filter((row) => row.productId && row.quantity > 0)
      .map((row) => ({
        productId: Number(row.productId),
        quantity: Number(row.quantity),
      }));

    if (validItems.length === 0) {
      toast.error('Agrega al menos un producto válido.');
      return;
    }

    setSubmitting(true);
    const loadToast = toast.loading('Registrando entrada de stock...');
    try {
      await warehouseService.createStockEntry({
        reference: reference.trim() || null,
        items: validItems,
      });
      toast.success('Entrada de stock registrada y existencias actualizadas.', { id: loadToast });
      setReference('');
      setItems([{ productId: defaultProductId, quantity: 1 }]);
      setScanInput('');
      onClose();
      onCreated();
    } catch (err) {
      toast.error(
        'Error al registrar entrada: ' + (err.response?.data?.message || err.message),
        { id: loadToast }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Registrar entrada de stock</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Suma unidades al inventario por reabastecimiento o recepción de mercancía.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Referencia / Folio de recepción (opcional)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ej. REM-1042 o Compra proveedor"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white"
              />
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="entry-sku-scanner"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-300"
                >
                  <ScanBarcode size={14} className="text-emerald-400" />
                  <span>Escanear código de barras / SKU (Enter para sumar)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setScannerOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  <Camera size={12} />
                  <span>Usar cámara</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  id="entry-sku-scanner"
                  ref={scanInputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={handleScanKeyDown}
                  placeholder="Ej. SKU-001 o escanea con lector USB..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => handleScanCode(scanInput)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  Agregar
                </button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-400">
                No hay productos registrados en el catálogo.
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((row, index) => {
                  const selectedProd = getProductById(row.productId);
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-3 rounded-lg bg-zinc-950 border border-zinc-800"
                    >
                      <div className="sm:col-span-7">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Producto
                        </label>
                        <select
                          value={row.productId}
                          onChange={(e) => handleChangeRow(index, 'productId', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.sku} — {p.name} (Actual: {p.stockQuantity})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Unidades a ingresar
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={row.quantity}
                          onChange={(e) => handleChangeRow(index, 'quantity', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                          required
                        />
                        {selectedProd && (
                          <span className="block text-[10px] font-mono text-zinc-500 mt-1">
                            Nuevo stock: {selectedProd.stockQuantity + (Number(row.quantity) || 0)}
                          </span>
                        )}
                      </div>

                      <div className="sm:col-span-1 flex justify-end sm:pb-5">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          disabled={items.length === 1}
                          className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Eliminar renglón"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {products.length > 0 && (
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Agregar otro producto</span>
              </button>
            )}

            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-400 block">Total de unidades a ingresar</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  +{totalUnits} unids.
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || products.length === 0}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-50 text-xs font-semibold text-zinc-950 transition-colors cursor-pointer"
                >
                  {submitting ? 'Guardando...' : 'Registrar entrada'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <BarcodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanCode}
        title="Escanear SKU para entrada de stock"
      />
    </>
  );
}