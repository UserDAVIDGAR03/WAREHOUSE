import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { authService } from '../../api/warehouseApi';

export default function AuthFormView({ mode, onSwitchMode, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const loadToast = toast.loading(isRegister ? 'Creando cuenta...' : 'Verificando credenciales...');
    try {
      if (isRegister) {
        await authService.register({ username, email, password });
        onSwitchMode('login');
        toast.success('Registro completado. Ya puedes iniciar sesión.', { id: loadToast });
      } else {
        const res = await authService.login({ email, password });
        toast.success('¡Bienvenido a Warehouse OS!', { id: loadToast });
        onLoginSuccess(res.data.token);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error en la autenticación.', { id: loadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full bg-zinc-950 text-zinc-100 overflow-y-auto">
      {/* COLUMNA IZQUIERDA: Identidad visual y contexto operativo */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 bg-zinc-900 border-r border-zinc-800 overflow-hidden">
        {/* Retícula técnica de fondo */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Marca superior */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSwitchMode('welcome')}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Volver a portada</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-sm">
              W
            </div>
            <span className="font-semibold tracking-tight text-white">Warehouse OS</span>
          </div>
        </div>

        {/* Bloque central */}
        <div className="relative z-10 max-w-xl my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700 text-xs font-medium text-zinc-300 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Sistema de gestión logística v2.0
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white leading-[1.15] mb-4">
            Control total sobre cada unidad en tu almacén.
          </h2>

          <p className="text-base text-zinc-400 leading-relaxed">
            Supervisa existencias críticas, audita salidas en tiempo real y coordina reabastecimiento con proveedores desde una sola interfaz.
          </p>
        </div>

        {/* Pie informativo */}
        <div className="relative z-10 flex items-center text-xs text-zinc-500 border-t border-zinc-800/80 pt-5">
          <span className="inline-flex items-center gap-1.5">
            <Shield size={14} className="text-zinc-400" />
            Sesión protegida con autenticación por token
          </span>
        </div>
      </div>

      {/* COLUMNA DERECHA: Formulario limpio de alto contraste */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-12 bg-zinc-950">
        {/* Cabecera móvil */}
        <div className="flex lg:hidden items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => onSwitchMode('welcome')}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Inicio</span>
          </button>
          <span className="font-semibold text-sm text-white">Warehouse OS</span>
        </div>

        {/* Contenedor centrado del formulario */}
        <div className="w-full max-w-sm mx-auto my-auto">
          {/* Switcher superior minimalista */}
          <div className="inline-flex p-1 rounded-lg bg-zinc-900 border border-zinc-800 mb-8">
            <button
              type="button"
              onClick={() => onSwitchMode('login')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => onSwitchMode('register')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {isRegister ? 'Crea tu cuenta operativa' : 'Bienvenido de nuevo'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5">
              {isRegister
                ? 'Completa tus datos para habilitar tu acceso al sistema.'
                : 'Introduce tus credenciales corporativas para continuar.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label
                  htmlFor="auth-username"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Nombre de usuario
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                  />
                  <input
                    id="auth-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. david.cruz"
                    className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-medium text-zinc-300"
                >
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 disabled:opacity-60 text-zinc-950 font-semibold text-sm py-2.5 px-4 rounded-lg transition-all cursor-pointer"
            >
              <span>
                {isSubmitting
                  ? 'Procesando...'
                  : isRegister
                  ? 'Crear cuenta'
                  : 'Continuar'}
              </span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-6 text-xs text-zinc-500 text-center">
            {isRegister ? '¿Ya tienes una cuenta registrada? ' : '¿Aún no tienes acceso? '}
            <button
              type="button"
              onClick={() => onSwitchMode(isRegister ? 'login' : 'register')}
              className="text-white hover:underline font-medium cursor-pointer"
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
            </button>
          </p>
        </div>

        {/* Espacio inferior equilibrado */}
        <div className="hidden lg:block text-center text-[11px] text-zinc-600">
          Warehouse OS • Gestión de Inventario y Operaciones
        </div>
      </div>
    </div>
  );
}