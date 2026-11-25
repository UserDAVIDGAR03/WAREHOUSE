import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Boxes,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function WelcomeView({ onNavigate }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between min-h-screen w-full bg-zinc-950 text-zinc-100 overflow-y-auto">
      {/* Retícula sutil de fondo */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Barra superior */}
      <header className="relative z-10 w-full border-b border-zinc-800/90 bg-zinc-950/90">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-sm">
              W
            </div>
            <span className="font-semibold tracking-tight text-white">Warehouse OS</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-xs sm:text-sm font-medium text-zinc-300 hover:text-white px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-xs sm:text-sm font-semibold bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-10 py-12 lg:py-16 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna izquierda: Propuesta principal y acciones */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Control de Inventarios, Proveedores y Salidas
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-5">
              Operación de almacén clara, rápida y trazable.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mb-8">
              Centraliza el control de existencias, detecta faltantes antes de que frenen el despacho y administra proveedores y órdenes desde un entorno unificado.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-10">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Acceder al panel</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Registrar operador</span>
              </button>
            </div>

            {/* Puntos clave en línea limpia */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400 pt-6 border-t border-zinc-800/80">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Autenticación con JWT
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Alertas de stock mínimo
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Exportación de reportes CSV
              </span>
            </div>
          </div>

          {/* Columna derecha: Panel de resumen de módulos */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                <span className="text-xs font-semibold text-zinc-200">
                  Módulos incluidos en el sistema
                </span>
                <span className="text-[11px] font-mono text-zinc-500">v2.0</span>
              </div>

              <div className="divide-y divide-zinc-800/80">
                <div className="p-5 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 shrink-0 mt-0.5">
                    <Boxes size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Catálogo y existencias
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Alta de productos, consulta de stock en tiempo real y monitoreo de artículos críticos.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 shrink-0 mt-0.5">
                    <FileSpreadsheet size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Órdenes y proveedores
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Seguimiento de órdenes de salida y directorio centralizado de abastecimiento.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 shrink-0 mt-0.5">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Trazabilidad y control de acceso
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Registro de operaciones, validación de umbral mínimo y sesiones protegidas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-zinc-950/70 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-zinc-300" />
                  Entorno operativo listo
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-300 font-medium">
                  <BarChart3 size={14} />
                  KPIs en vivo
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="relative z-10 w-full border-t border-zinc-800/80 py-4 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>Warehouse OS — Sistema de Gestión de Inventario</span>
          <span>Operación y Control</span>
        </div>
      </footer>
    </div>
  );
}