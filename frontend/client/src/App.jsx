import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { warehouseService } from './api/warehouseApi';
import WelcomeView from './pages/auth/WelcomeView';
import AuthFormView from './pages/auth/AuthFormView';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import KpiCards from './components/dashboard/KpiCards';
import ProductsTab from './pages/dashboard/ProductsTab';
import SuppliersTab from './pages/dashboard/SuppliersTab';
import AlertsTab from './pages/dashboard/AlertsTab';
import OrdersTab from './pages/dashboard/OrdersTab';
import AddProductTab from './pages/dashboard/AddProductTab';

const TAB_META = {
  products: {
    title: 'Inventario general',
    subtitle: 'Control de existencias, precios unitarios y proveedores activos',
  },
  suppliers: {
    title: 'Proveedores',
    subtitle: 'Directorio de distribuidores y alta de canales de suministro',
  },
  alerts: {
    title: 'Stock crítico',
    subtitle: 'Monitoreo de artículos por debajo o en su límite mínimo',
  },
  orders: {
    title: 'Órdenes de salida',
    subtitle: 'Trazabilidad de despachos y movimientos registrados',
  },
  add: {
    title: 'Nuevo producto',
    subtitle: 'Alta de artículo y configuración de umbral de alerta',
  },
};

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('welcome');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [prodRes, suppRes, ordRes] = await Promise.all([
        warehouseService.getProducts(),
        warehouseService.getSuppliers(),
        warehouseService.getOrders(),
      ]);
      setProducts(prodRes.data || []);
      setSuppliers(suppRes.data || []);
      setOrders(ordRes.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthMode('login');
  };

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minimumStockAlert).length;

  if (!token) {
    if (authMode === 'welcome') {
      return (
        <>
          <Toaster position="top-right" />
          <WelcomeView onNavigate={(mode) => setAuthMode(mode)} />
        </>
      );
    }
    return (
      <>
        <Toaster position="top-right" />
        <AuthFormView
          mode={authMode}
          onSwitchMode={(mode) => setAuthMode(mode)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  const currentMeta = TAB_META[activeTab] || TAB_META.products;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative selection:bg-white selection:text-zinc-950">
      {/* Retícula técnica coherente con Login, Register y Welcome */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fafafa',
            border: '1px solid #27272a',
            fontSize: '13px',
          },
        }}
      />

      <Header onLogout={handleLogout} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 items-start">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={{
            products: products.length,
            suppliers: suppliers.length,
            lowStock: lowStockCount,
            orders: orders.length,
          }}
        />

        <main className="flex-1 w-full min-w-0 space-y-6">
          {/* Encabezado contextual de la vista */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-zinc-800/90">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-mono text-zinc-400 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>PANEL OPERATIVO / {activeTab.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {currentMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                {currentMeta.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAllData}
              disabled={loading}
              className="self-start sm:self-auto text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sincronizando...' : 'Actualizar datos'}
            </button>
          </div>

          <KpiCards products={products} lowStockCount={lowStockCount} />

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              loading={loading}
              onAddClick={() => setActiveTab('add')}
              onCreated={fetchAllData}
            />
          )}
          {activeTab === 'suppliers' && (
            <SuppliersTab suppliers={suppliers} onCreated={fetchAllData} />
          )}
          {activeTab === 'alerts' && <AlertsTab products={products} />}
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              products={products}
              onCreated={fetchAllData}
            />
          )}
          {activeTab === 'add' && (
            <AddProductTab
              suppliers={suppliers}
              onCreated={() => {
                fetchAllData();
                setActiveTab('products');
              }}
              onCancel={() => setActiveTab('products')}
            />
          )}
        </main>
      </div>
    </div>
  );
}