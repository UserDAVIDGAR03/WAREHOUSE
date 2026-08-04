import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  Package,
  Building2,
  AlertTriangle,
  ClipboardList,
  Plus,
  LogOut,
  CircleDot,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Database,
  Layers
} from 'lucide-react';

const API_BASE = 'http://localhost:5289/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authView, setAuthView] = useState('welcome'); // 'welcome', 'login', 'register'

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Dashboard States
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Aumentado para aprovechar mejor el espacio

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    description: '',
    unitPrice: '',
    stockQuantity: '',
    minimumStockAlert: 5,
    supplierId: 1
  });

  // New Supplier Form State
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactEmail: '',
    phone: ''
  });

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const prodRes = await axios.get(`${API_BASE}/products`, config);
      setProducts(prodRes.data);

      const lowRes = await axios.get(`${API_BASE}/products/low-stock`, config);
      setLowStock(lowRes.data);

      const ordRes = await axios.get(`${API_BASE}/orders`, config);
      setOrders(ordRes.data);

      const supRes = await axios.get(`${API_BASE}/suppliers`, config);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Procesando...');
    try {
      if (authView === 'register') {
        await axios.post(`${API_BASE}/auth/register`, { username, email, password });
        setAuthView('login');
        toast.success('Registro completado. Ya puedes iniciar sesión.', { id: loadToast });
      } else {
        const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        toast.success('¡Bienvenido al sistema!', { id: loadToast });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error en la autenticación.', { id: loadToast });
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Guardando producto...');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        ...newProduct,
        unitPrice: parseFloat(newProduct.unitPrice) || 0,
        stockQuantity: parseInt(newProduct.stockQuantity) || 0,
        minimumStockAlert: parseInt(newProduct.minimumStockAlert) || 5,
        supplierId: parseInt(newProduct.supplierId) || 1
      };

      await axios.post(`${API_BASE}/products`, payload, config);
      toast.success('¡Producto registrado exitosamente!', { id: loadToast });
      setNewProduct({ sku: '', name: '', description: '', unitPrice: '', stockQuantity: '', minimumStockAlert: 5, supplierId: 1 });
      loadData();
    } catch (err) {
      toast.error('Error al registrar: ' + (err.response?.data?.message || err.message), { id: loadToast });
    }
  };

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Registrando proveedor...');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_BASE}/suppliers`, newSupplier, config);
      toast.success('¡Proveedor dado de alta correctamente!', { id: loadToast });
      setNewSupplier({ name: '', contactEmail: '', phone: '' });
      loadData();
    } catch (err) {
      toast.error('Error al registrar: ' + (err.response?.data?.message || err.message), { id: loadToast });
    }
  };

  const exportToCSV = () => {
    if (products.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    const headers = ['SKU', 'Nombre', 'Proveedor', 'Precio Unitario', 'Stock', 'Min Alerta'];
    const rows = products.map(p => [
      p.sku,
      `"${p.name}"`,
      `"${p.supplier?.name || p.supplierId}"`,
      p.unitPrice,
      p.stockQuantity,
      p.minimumStockAlert
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventario_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Reporte exportado con éxito');
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setAuthView('welcome');
    toast('Sesión finalizada', { icon: '👋' });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalInventoryValue = products.reduce((acc, p) => acc + (p.unitPrice * p.stockQuantity), 0);

  const navItems = [
    { id: 'products', label: 'Inventario general', icon: Package, count: products.length },
    { id: 'suppliers', label: 'Directorio de proveedores', icon: Building2, count: suppliers.length },
    { id: 'alerts', label: 'Stock crítico', icon: AlertTriangle, count: lowStock.length, danger: true },
    { id: 'orders', label: 'Órdenes de salida', icon: ClipboardList, count: orders.length },
  ];

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] text-[#e0e1dd] flex items-center justify-center p-8" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <Toaster position="top-right" />
        
        {/* VISTA 1: WELCOME SCREEN EXPANDIDO */}
        {authView === 'welcome' && (
          <div className="w-full max-w-3xl bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#e0e1dd] rounded-xl flex items-center justify-center text-[#0d1b2a] font-bold text-2xl mx-auto mb-6 shadow-md">W</div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">Warehouse OS Enterprise Suite</h1>
            <p className="text-base text-[#adb5bd] max-w-xl mx-auto mb-10 leading-relaxed">
              Plataforma centralizada de control de inventarios, gestión logística y seguimiento de proveedores en tiempo real con seguridad robusta.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
              <div className="p-6 bg-[#0d1b2a] border border-[#415a77] rounded-xl shadow-inner">
                <ShieldCheck size={28} className="text-[#4cc9f0] mb-3" />
                <h3 className="text-sm font-bold text-white">Seguridad JWT</h3>
                <p className="text-xs text-[#adb5bd] mt-1">Control estricto de acceso corporativo por tokens cifrados.</p>
              </div>
              <div className="p-6 bg-[#0d1b2a] border border-[#415a77] rounded-xl shadow-inner">
                <Database size={28} className="text-[#2ec4b6] mb-3" />
                <h3 className="text-sm font-bold text-white">PostgreSQL</h3>
                <p className="text-xs text-[#adb5bd] mt-1">Transacciones relacionales ACID totalmente garantizadas.</p>
              </div>
              <div className="p-6 bg-[#0d1b2a] border border-[#415a77] rounded-xl shadow-inner">
                <Layers size={28} className="text-[#f72585] mb-3" />
                <h3 className="text-sm font-bold text-white">Tiempo Real</h3>
                <p className="text-xs text-[#adb5bd] mt-1">Monitoreo de stock crítico y reportes ejecutivos.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setAuthView('login')} 
                className="bg-[#4cc9f0] hover:bg-[#3aa8d0] text-[#0d1b2a] font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Iniciar sesión <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setAuthView('register')} 
                className="bg-transparent border-2 border-[#415a77] hover:bg-[#415a77]/30 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all"
              >
                Registrar nueva cuenta
              </button>
            </div>
          </div>
        )}

        {/* VISTA 2: LOGIN / REGISTER EXPANDIDO */}
        {(authView === 'login' || authView === 'register') && (
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setAuthView('welcome')} 
                className="text-sm text-[#4cc9f0] hover:underline font-medium transition-colors flex items-center gap-1.5"
              >
                ← Volver al inicio
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#4cc9f0] rounded flex items-center justify-center text-[#0d1b2a] font-bold text-xs">W</div>
                <span className="font-bold text-sm text-white">Warehouse OS</span>
              </div>
            </div>

            <div className="bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-2xl p-10">
              <h1 className="text-xl font-bold text-white mb-2">
                {authView === 'register' ? 'Crear una cuenta' : 'Acceder a tu cuenta'}
              </h1>
              <p className="text-xs text-[#adb5bd] mb-8">
                Ingresa tus credenciales autorizadas en el sistema corporativo.
              </p>

              <form onSubmit={handleAuth} className="space-y-5">
                {authView === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide">Nombre de usuario</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" required />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide">Correo electrónico</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide">Contraseña</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" required />
                </div>

                <button type="submit" className="w-full bg-[#4cc9f0] hover:bg-[#3aa8d0] text-[#0d1b2a] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg mt-2">
                  {authView === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </form>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setAuthView(authView === 'register' ? 'login' : 'register')} 
                className="text-xs text-[#adb5bd] hover:text-white transition-colors"
              >
                {authView === 'register' ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
                <span className="font-bold text-[#4cc9f0]">{authView === 'register' ? 'Inicia sesión' : 'Regístrate'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-[#e0e1dd] flex flex-col" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <Toaster position="top-right" />
      
      {/* Barra superior más amplia */}
      <header className="h-18 bg-[#1b263b] border-b border-[#415a77] px-8 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#4cc9f0] rounded-xl flex items-center justify-center text-[#0d1b2a] font-bold text-base">W</div>
          <span className="font-bold text-lg text-white tracking-tight">Warehouse OS</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="hidden sm:flex items-center gap-2 text-[#2ec4b6] font-semibold">
            <CircleDot size={14} strokeWidth={3} className="text-[#2ec4b6]" />
            <span>Conectado a base de datos PostgreSQL</span>
          </div>
          <span className="text-[#415a77]">|</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[#ff4d6d] hover:text-white font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#ff4d6d]/20">
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenedor principal expandido */}
      <div className="flex flex-1 max-w-[1700px] mx-auto w-full p-6 gap-8">
        {/* Sidebar Ampliado */}
        <aside className="w-72 shrink-0 bg-[#1b263b] border border-[#415a77] rounded-2xl min-h-[calc(100vh-100px)] p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="pb-3 text-xs font-bold tracking-wider text-[#778da9] uppercase">Módulos del Sistema</div>
            <nav className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-[#4cc9f0] text-[#0d1b2a] shadow-lg'
                        : 'text-[#e0e1dd] hover:bg-[#415a77]/40'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} strokeWidth={2.2} />
                      {item.label}
                    </span>
                    <span className={`font-mono text-xs px-2.5 py-1 rounded-lg ${
                      item.danger && item.count > 0
                        ? 'bg-[#ff4d6d] text-white'
                        : active ? 'bg-[#0d1b2a] text-[#4cc9f0]' : 'bg-[#0d1b2a] text-[#adb5bd]'
                    }`}>
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="pb-3 text-xs font-bold tracking-wider text-[#778da9] uppercase">Acciones rápidas</div>
            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                activeTab === 'add'
                  ? 'bg-[#2ec4b6] text-[#0d1b2a]'
                  : 'bg-[#0d1b2a] border border-[#415a77] text-[#2ec4b6] hover:bg-[#415a77]/30'
              }`}
            >
              <Plus size={18} />
              Registrar nuevo producto
            </button>
          </div>
        </aside>

        {/* Panel principal expandido */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Métricas más grandes y vistosas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#1b263b] border border-[#415a77] p-6 rounded-2xl shadow-xl">
              <p className="text-xs font-bold text-[#778da9] uppercase tracking-wider">Total SKUs activos</p>
              <p className="text-4xl font-extrabold font-mono text-white mt-3">{products.length}</p>
              <span className="text-xs text-[#2ec4b6] mt-2 block font-medium">Catálogo general actualizado</span>
            </div>

            <div className="bg-[#1b263b] border border-[#415a77] p-6 rounded-2xl shadow-xl">
              <p className="text-xs font-bold text-[#778da9] uppercase tracking-wider">Valor global del inventario</p>
              <p className="text-4xl font-extrabold font-mono text-[#2ec4b6] mt-3">${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <span className="text-xs text-[#adb5bd] mt-2 block font-medium">Cálculo basado en costos unitarios</span>
            </div>

            <div className="bg-[#1b263b] border border-[#415a77] p-6 rounded-2xl shadow-xl">
              <p className="text-xs font-bold text-[#778da9] uppercase tracking-wider">Alertas de stock crítico</p>
              <p className={`text-4xl font-extrabold font-mono mt-2 ${lowStock.length > 0 ? 'text-[#ff4d6d]' : 'text-white'}`}>{lowStock.length}</p>
              <span className="text-xs text-[#adb5bd] mt-2 block font-medium">Productos bajo mínimo requerido</span>
            </div>
          </div>

          {activeTab === 'products' && (
            <div className="bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#415a77] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d1b2a]/40">
                <div>
                  <h2 className="text-lg font-bold text-white">Inventario general de productos</h2>
                  <p className="text-xs text-[#adb5bd] mt-1">Control centralizado y búsqueda avanzada en tiempo real.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por SKU o Nombre..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full sm:w-80 bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#778da9] focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]"
                  />
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={exportToCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0d1b2a] border border-[#415a77] hover:bg-[#415a77]/30 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
                      <Download size={16} />
                      Exportar CSV
                    </button>
                    <button onClick={() => setActiveTab('add')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#4cc9f0] hover:bg-[#3aa8d0] text-[#0d1b2a] text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md">
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#415a77] text-[#778da9] font-bold bg-[#0d1b2a]/60 uppercase tracking-wider text-xs">
                      <th className="p-5 px-8">SKU</th>
                      <th className="p-5">Producto</th>
                      <th className="p-5">Proveedor</th>
                      <th className="p-5 text-right">Precio unitario</th>
                      <th className="p-5 text-right px-8">Stock disponible</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#415a77]/50">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="p-5 px-8"><div className="h-5 bg-[#415a77] rounded w-20"></div></td>
                          <td className="p-5"><div className="h-5 bg-[#415a77] rounded w-48"></div></td>
                          <td className="p-5"><div className="h-5 bg-[#415a77] rounded w-32"></div></td>
                          <td className="p-5 text-right"><div className="h-5 bg-[#415a77] rounded w-16 ml-auto"></div></td>
                          <td className="p-5 text-right px-8"><div className="h-5 bg-[#415a77] rounded w-20 ml-auto"></div></td>
                        </tr>
                      ))
                    ) : paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-16 text-center text-[#778da9] font-medium text-base">No se encontraron productos registrados.</td>
                      </tr>
                    ) : (
                      paginatedProducts.map(p => (
                        <tr key={p.id} className="hover:bg-[#415a77]/20 transition-colors">
                          <td className="p-5 px-8 font-mono font-semibold text-[#4cc9f0]">{p.sku}</td>
                          <td className="p-5 font-semibold text-white">{p.name}</td>
                          <td className="p-5 text-[#adb5bd] font-medium">{p.supplier?.name || `ID: ${p.supplierId}`}</td>
                          <td className="p-5 text-right font-mono text-[#e0e1dd]">${p.unitPrice.toFixed(2)}</td>
                          <td className="p-5 text-right px-8">
                            <span className={`inline-block px-3.5 py-1.5 rounded-lg font-mono font-bold text-xs ${p.stockQuantity <= p.minimumStockAlert ? 'bg-[#ff4d6d]/20 text-[#ff4d6d] border border-[#ff4d6d]/40' : 'bg-[#0d1b2a] text-[#2ec4b6]'}`}>
                              {p.stockQuantity} unids.
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Controles de Paginación más grandes */}
              <div className="p-5 border-t border-[#415a77] flex items-center justify-between text-sm text-[#adb5bd] bg-[#0d1b2a]/40">
                <span className="font-medium">Mostrando página <strong className="text-white">{currentPage}</strong> de <strong className="text-white">{totalPages}</strong></span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-[#415a77] rounded-xl bg-[#1b263b] hover:bg-[#415a77]/40 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-[#415a77] rounded-xl bg-[#1b263b] hover:bg-[#415a77]/40 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-[#415a77] bg-[#0d1b2a]/40">
                  <h2 className="text-lg font-bold text-white">Directorio de proveedores</h2>
                  <p className="text-xs text-[#adb5bd] mt-1">Empresas externas y canales de suministro vinculados.</p>
                </div>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#415a77] text-[#778da9] font-bold bg-[#0d1b2a]/60 uppercase tracking-wider text-xs">
                      <th className="p-5 px-8">ID</th>
                      <th className="p-5">Razón social</th>
                      <th className="p-5">Correo electrónico</th>
                      <th className="p-5 px-8">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#415a77]/50">
                    {suppliers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-16 text-center text-[#778da9] font-medium text-base">No hay proveedores en la base de datos.</td>
                      </tr>
                    ) : (
                      suppliers.map(s => (
                        <tr key={s.id} className="hover:bg-[#415a77]/20 transition-colors">
                          <td className="p-5 px-8 font-mono font-semibold text-[#778da9]">#{s.id}</td>
                          <td className="p-5 font-semibold text-white">{s.name}</td>
                          <td className="p-5 text-[#adb5bd]">{s.contactEmail}</td>
                          <td className="p-5 px-8 text-[#adb5bd] font-mono">{s.phone}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-xl p-8 h-fit">
                <h3 className="text-lg font-bold text-white mb-1">Registrar proveedor</h3>
                <p className="text-xs text-[#adb5bd] mb-6">Añade una nueva entidad externa al sistema.</p>
                <form onSubmit={handleCreateSupplier} className="space-y-5 text-sm">
                  <div>
                    <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Nombre o empresa</label>
                    <input type="text" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" placeholder="Ej. Logística Global S.A." required />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Correo de contacto</label>
                    <input type="email" value={newSupplier.contactEmail} onChange={e => setNewSupplier({...newSupplier, contactEmail: e.target.value})} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" placeholder="contacto@empresa.com" required />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Teléfono</label>
                    <input type="text" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" placeholder="5551234567" required />
                  </div>
                  <button type="submit" className="w-full bg-[#4cc9f0] hover:bg-[#3aa8d0] text-[#0d1b2a] font-bold py-3.5 rounded-xl transition-all shadow-lg mt-2">Guardar proveedor</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#415a77] bg-[#0d1b2a]/40">
                <h2 className="text-lg font-bold text-[#ff4d6d] flex items-center gap-2.5">
                  <AlertTriangle size={20} />
                  Monitoreo de stock crítico
                </h2>
                <p className="text-xs text-[#adb5bd] mt-1">Artículos cuya existencia se encuentra por debajo del límite de seguridad.</p>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#415a77] text-[#778da9] font-bold bg-[#0d1b2a]/60 uppercase tracking-wider text-xs">
                    <th className="p-5 px-8">SKU</th>
                    <th className="p-5">Producto</th>
                    <th className="p-5 text-right">Stock actual</th>
                    <th className="p-5 text-right px-8">Mínimo requerido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#415a77]/50">
                  {lowStock.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-16 text-center text-[#778da9] font-medium text-base">Sin alertas críticas. Estado operativo óptimo.</td>
                    </tr>
                  ) : (
                    lowStock.map(p => (
                      <tr key={p.id} className="hover:bg-[#415a77]/20 transition-colors">
                        <td className="p-5 px-8 font-mono text-[#778da9]">{p.sku}</td>
                        <td className="p-5 font-semibold text-white">{p.name}</td>
                        <td className="p-5 text-right font-mono font-bold text-[#ff4d6d]">{p.stockQuantity} unids.</td>
                        <td className="p-5 text-right px-8 font-mono text-[#778da9]">{p.minimumStockAlert} unids.</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#415a77] bg-[#0d1b2a]/40">
                <h2 className="text-lg font-bold text-white">Historial de órdenes de salida</h2>
                <p className="text-xs text-[#adb5bd] mt-1">Registro transaccional automatizado de operaciones logísticas.</p>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#415a77] text-[#778da9] font-bold bg-[#0d1b2a]/60 uppercase tracking-wider text-xs">
                    <th className="p-5 px-8">Folio de orden</th>
                    <th className="p-5">Fecha y hora</th>
                    <th className="p-5">Estado</th>
                    <th className="p-5 text-right px-8">Monto total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#415a77]/50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-16 text-center text-[#778da9] font-medium text-base">No se encontraron órdenes registradas.</td>
                    </tr>
                  ) : (
                    orders.map(o => (
                      <tr key={o.id} className="hover:bg-[#415a77]/20 transition-colors">
                        <td className="p-5 px-8 font-mono font-semibold text-[#4cc9f0]">{o.orderNumber}</td>
                        <td className="p-5 text-[#adb5bd]">{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="p-5">
                          <span className="inline-flex items-center gap-2 text-[#2ec4b6] font-semibold">
                            <CircleDot size={10} strokeWidth={4} />
                            {o.status || 'Completada'}
                          </span>
                        </td>
                        <td className="p-5 text-right px-8 font-mono font-bold text-white">${o.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="max-w-2xl bg-[#1b263b] border border-[#415a77] rounded-2xl shadow-xl p-10">
              <h2 className="text-xl font-bold text-white mb-2">Registrar nuevo producto</h2>
              <p className="text-xs text-[#adb5bd] mb-8">Añade existencias e integra un proveedor oficial al catálogo del almacén.</p>
              <form onSubmit={handleCreateProduct} className="space-y-5 text-sm">
                <div>
                  <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">SKU (código único)</label>
                  <input type="text" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" placeholder="Ej. SKU-9920" required />
                </div>
                <div>
                  <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Nombre del artículo</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" placeholder="Ej. Tarima de madera reforzada" required />
                </div>
                <div>
                  <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Descripción técnica</label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0] h-24 resize-none" placeholder="Especificaciones de tamaño, peso o ubicación..." />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Precio unitario ($)</label>
                    <input type="number" step="0.01" value={newProduct.unitPrice === '' ? '' : newProduct.unitPrice} onChange={e => setNewProduct({...newProduct, unitPrice: e.target.value})} className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" placeholder="0.00" required />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Stock inicial</label>
                    <input type="number" value={newProduct.stockQuantity === '' ? '' : newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} className="w-full bg-colored bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]" placeholder="0" required />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[#adb5bd] mb-2 uppercase tracking-wide text-xs">Proveedor asignado</label>
                  <select
                    value={newProduct.supplierId}
                    onChange={e => setNewProduct({...newProduct, supplierId: e.target.value})}
                    className="w-full bg-[#0d1b2a] border border-[#415a77] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]"
                    required
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#0d1b2a] text-white">
                        {s.name} (ID: {s.id})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full bg-[#4cc9f0] hover:bg-[#3aa8d0] text-[#0d1b2a] font-bold py-4 rounded-xl transition-all shadow-lg mt-4 text-base">Guardar producto en base de datos</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;