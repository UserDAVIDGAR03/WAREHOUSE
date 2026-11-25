import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle } from 'lucide-react';

export default function BarcodeScannerModal({
  isOpen,
  onClose,
  onScan,
  title = 'Escanear código de barras o QR',
}) {
  const scannerRef = useRef(null);
  const containerId = 'warehouse-barcode-scanner';
  const [errorMsg, setErrorMsg] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setErrorMsg('');
    setStarting(true);

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 260, height: 150 },
          },
          (decodedText) => {
            if (!isMounted) return;
            const cleaned = String(decodedText || '').trim();
            if (!cleaned) return;
            onScan?.(cleaned);
            onClose?.();
          },
          () => {}
        );
      } catch (err) {
        if (!isMounted) return;
        setErrorMsg(
          err?.message ||
            'No se pudo acceder a la cámara. Revisa los permisos o usa un lector USB.'
        );
      } finally {
        if (isMounted) setStarting(false);
      }
    };

    const timer = setTimeout(startScanner, 80);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      const instance = scannerRef.current;
      scannerRef.current = null;
      if (instance) {
        instance
          .stop()
          .then(() => instance.clear())
          .catch(() => {});
      }
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={16} className="text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">{title}</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {starting && !errorMsg && (
            <p className="text-xs text-zinc-400 text-center">Iniciando cámara...</p>
          )}

          {errorMsg ? (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-medium text-rose-200">Error de cámara</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          ) : (
            <div
              id={containerId}
              className="w-full min-h-60 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800"
            />
          )}

          <p className="text-[11px] text-zinc-500 text-center">
            Apunta el código de barras o SKU hacia el recuadro para detectarlo automáticamente.
          </p>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}