import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, ScanBarcode, Camera } from 'lucide-react';
import { warehouseService } from '../../api/warehouseApi';
import BarcodeScannerModal from '../../pages/dashboard/BarcodeScannerModal';

export default function NewOrderModal({ isOpen, onClose, products = [], onCreated }) {
  const availableProducts = products.filter((p) => p.stockQuantity > 0);
  const defaultProductId = availableProducts[0]?.id || '';

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

    if (matched.stockQuantity <= 0) {
      toast.error(`"${matched.name}" no tiene stock disponible.`);
      setScanInput('');
      scanInputRef.current?.focus();
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((r) => Number(r.productId) === matched.id);
      if (existingIndex !== -1) {
        const currentQty = Number(prev[existingIndex].quantity) || 0;
        if (currentQty + 1 > matched.stockQuantity) {
          toast.error(
            `Stock máximo alcanzado para ${matched.name} (${matched.stockQuantity}).`
          );
          return prev;
        }
        toast.success(`+1 ${matched.name} (${currentQty + 1} en orden)`);
        return prev.map((r, idx) =>
          idx === existingIndex ? { ...r, quantity: currentQty + 1 } : r
        );
      }

      toast.success(`Agregado: ${matched.name}`);
      const hasOnlyEmptyOrDefault =
        prev.length === 1 && !prev[0].productId;
      if (hasOnlyEmptyOrDefault) {
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
      { productId: availableProducts[0]?.id || '', quantity: 1 },
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

  const estimatedTotal = items.reduce((acc, row) => {
    const prod = getProductById(row.productId);
    if (!prod) return acc;
    return acc + prod.unitPrice * row.quantity;
  }, 0);

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

    for (const row of validItems) {
      const prod = getProductById(row.productId);
      if (!prod) {
        toast.error('Selecciona un producto válido.');
        return;
      }
      if (row.quantity > prod.stockQuantity) {
        toast.error(`Stock insuficiente para ${prod.name} (disponible: ${prod.stockQuantity}).`);
        return;
      }
    }

    setSubmitting(true);
    const loadToast = toast.loading('Registrando orden de salida...');
    try {
      await warehouseService.createOrder({ items: validItems });
      toast.success('Orden de salida registrada y stock actualizado.', { id: loadToast });
      setItems([{ productId: availableProducts[0]?.id || '', quantity: 1 }]);
      setScanInput('');
      onClose();
      onCreated();
    } catch (err) {
      toast.error(
        'Error al crear la orden: ' + (err.response?.data?.message || err.message),
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
              <h3 className="text-base font-semibold text-white">Nueva orden de salida</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Escanea códigos SKU o selecciona productos para descontar existencias.
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
            {/* Barra de escaneo rápido por SKU / código de barras */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="order-sku-scanner"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-300"
                >
                  <ScanBarcode size={14} className="text-emerald-400" />
                  <span>Escanear código de barras / SKU (Enter para agregar)</span>
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
                  id="order-sku-scanner"
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
                  Buscar
                </button>
              </div>
            </div>

            {availableProducts.length === 0 ? (
              <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-400">
                No hay productos con stock disponible para registrar una salida.
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((row, index) => {
                  const selectedProd = getProductById(row.productId);
                  const subtotal = selectedProd ? selectedProd.unitPrice * row.quantity : 0;

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-3 rounded-lg bg-zinc-950 border border-zinc-800"
                    >
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Producto
                        </label>
                        <select
                          value={row.productId}
                          onChange={(e) => handleChangeRow(index, 'productId', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                        >
                          {availableProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.sku} — {p.name} (Stock: {p.stockQuantity})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={selectedProd?.stockQuantity || 999999}
                          value={row.quantity}
                          onChange={(e) => handleChangeRow(index, 'quantity', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                          required
                        />
                      </div>

                      <div className="sm:col-span-3 text-right sm:pb-2">
                        <span className="block text-[11px] text-zinc-500">Subtotal</span>
                        <span className="font-mono text-xs font-semibold text-zinc-200">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="sm:col-span-1 flex justify-end sm:pb-1">
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

            {availableProducts.length > 0 && (
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
                <span className="text-xs text-zinc-400 block">Total estimado de la orden</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ${estimatedTotal.toFixed(2)}
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
                  disabled={submitting || availableProducts.length === 0}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-50 text-xs font-semibold text-zinc-950 transition-colors cursor-pointer"
                >
                  {submitting ? 'Guardando...' : 'Registrar salida'}
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
        title="Escanear SKU para orden de salida"
      />
    </>
  );
}