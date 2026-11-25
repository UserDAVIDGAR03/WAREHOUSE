import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Lock, User } from 'lucide-react';
import { authService } from '../../api/warehouseApi';

export default function AuthFormView({ mode, onSwitchMode, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Procesando...');
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
    }
  };

  return (
    <div className="w-full max-w-lg relative z-10">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onSwitchMode('welcome')}
          className="text-sm text-slate-400 hover:text-cyan-400 font-medium transition-colors flex items-center gap-1.5"
        >
          ← Volver al inicio
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-slate-950 font-black text-sm">
            W
          </div>
          <span className="font-bold text-base text-white">Warehouse OS</span>
        </div>
      </div>

      <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-12">
        <h1 className="text-2xl font-extrabold text-white mb-2">
          {isRegister ? 'Registrar operador' : 'Acceso al sistema'}
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          {isRegister
            ? 'Crea tus credenciales para administrar inventario y órdenes.'
            : 'Ingresa tu correo y contraseña corporativa para continuar.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Nombre de usuario
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. david.cruz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@warehouse.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-bold text-base py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 mt-3"
          >
            {isRegister ? 'Crear cuenta' : 'Entrar al panel'}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => onSwitchMode(isRegister ? 'login' : 'register')}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          {isRegister ? '¿Ya tienes cuenta? ' : '¿Aún no tienes acceso? '}
          <span className="font-bold text-cyan-400 hover:underline">
            {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
          </span>
        </button>
      </div>
    </div>
  );
}