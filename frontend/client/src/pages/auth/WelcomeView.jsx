import React from 'react';
import { ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

export default function WelcomeView({ onNavigate }) {
  return (
    <div className="w-full max-w-5xl bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-14 relative z-10">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          ENTERPRISE LOGISTICS & INVENTORY SUITE
        </div>

        <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg shadow-cyan-500/25 mb-6">
          W
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Warehouse <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">OS</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Control centralizado de inventarios, trazabilidad de órdenes de salida y gestión de proveedores con arquitectura empresarial en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-7 bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl transition-all group">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
            <ShieldCheck size={26} />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Seguridad JWT</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Autenticación cifrada y sesiones protegidas mediante tokens corporativos.
          </p>
        </div>

        <div className="p-7 bg-slate-950/80 border border-slate-800/90 hover:border-emerald-500/40 rounded-2xl transition-all group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
            <Database size={26} />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">PostgreSQL + EF Core</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Persistencia relacional ACID con consultas optimizadas y respaldos en contenedor.
          </p>
        </div>

        <div className="p-7 bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl transition-all group">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
            <Layers size={26} />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Alertas y Reportes</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Detección automática de stock mínimo y exportación ejecutiva en formato CSV.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onNavigate('login')}
          className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-bold text-base px-10 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5"
        >
          Iniciar sesión <ArrowRight size={20} />
        </button>
        <button
          onClick={() => onNavigate('register')}
          className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all"
        >
          Crear cuenta operativa
        </button>
      </div>
    </div>
  );
}