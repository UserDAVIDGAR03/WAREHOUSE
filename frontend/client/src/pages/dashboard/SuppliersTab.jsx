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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-800">
          <h2 className="text-xl font-extrabold text-white">Directorio de proveedores</h2>
          <p className="text-sm text-slate-400 mt-1">Empresas externas y canales de suministro vinculados.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60 uppercase tracking-wider text-xs">
                <th className="py-4 px-8">ID</th>
                <th className="py-4 px-5">Razón social</th>
                <th className="py-4 px-5">Correo de contacto</th>
                <th className="py-4 px-8">Teléfono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400 font-medium">
                    No hay proveedores registrados todavía.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-5 px-8 font-mono font-bold text-cyan-400">#{s.id}</td>
                    <td className="py-5 px-5 font-bold text-white">{s.name}</td>
                    <td className="py-5 px-5 text-slate-300">{s.contactEmail}</td>
                    <td className="py-5 px-8 text-slate-300 font-mono">{s.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl p-8 h-fit">
        <h3 className="text-xl font-extrabold text-white mb-1">Nuevo proveedor</h3>
        <p className="text-sm text-slate-400 mb-6">Da de alta un distribuidor autorizado.</p>
        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              Nombre o razón social
            </label>
            <input
              type="text"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Ej. Logística Global S.A."
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              Correo electrónico
            </label>
            <input
              type="email"
              value={newSupplier.contactEmail}
              onChange={(e) => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="contacto@empresa.com"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">
              Teléfono
            </label>
            <input
              type="text"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="7731152007"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 mt-2"
          >
            Guardar proveedor
          </button>
        </form>
      </div>
    </div>
  );
}