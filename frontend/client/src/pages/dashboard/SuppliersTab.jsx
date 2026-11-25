import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { warehouseService } from '../../api/warehouseApi';

export default function SuppliersTab({ suppliers, onCreated }) {
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactEmail: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Registrando proveedor...');
    try {
      await warehouseService.createSupplier(newSupplier);
      toast.success('¡Proveedor dado de alta correctamente!', { id: loadToast });
      setNewSupplier({ name: '', contactEmail: '', phone: '' });
      onCreated();
    } catch (err) {
      toast.error('Error al registrar: ' + (err.response?.data?.message || err.message), { id: loadToast });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white tracking-tight">Directorio de proveedores</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Empresas externas y canales de suministro vinculados.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-medium bg-zinc-950 text-xs">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-4">Razón social</th>
                <th className="py-3 px-4">Correo de contacto</th>
                <th className="py-3 px-6">Teléfono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center text-zinc-400 text-sm">
                    No hay proveedores registrados todavía.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-semibold text-zinc-300">#{s.id}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{s.name}</td>
                    <td className="py-3.5 px-4 text-zinc-300 text-xs">{s.contactEmail}</td>
                    <td className="py-3.5 px-6 text-zinc-300 font-mono text-xs">{s.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 h-fit">
        <h3 className="text-base font-semibold text-white tracking-tight">Nuevo proveedor</h3>
        <p className="text-xs text-zinc-400 mt-0.5 mb-5">Da de alta un distribuidor autorizado.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Nombre o razón social
            </label>
            <input
              type="text"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="Ej. Logística Global S.A."
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              value={newSupplier.contactEmail}
              onChange={(e) => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="contacto@empresa.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Teléfono
            </label>
            <input
              type="text"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="7731152007"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors mt-1 cursor-pointer"
          >
            Guardar proveedor
          </button>
        </form>
      </div>
    </div>
  );
}