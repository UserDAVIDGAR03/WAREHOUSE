import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { warehouseService } from './api/warehouseApi';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import KpiCards from './components/dashboard/KpiCards';

import WelcomeView from './pages/auth/WelcomeView';
import AuthFormView from './pages/auth/AuthFormView';

import ProductsTab from './pages/dashboard/ProductsTab';
import SuppliersTab from './pages/dashboard/SuppliersTab';
import AlertsTab from './pages/dashboard/AlertsTab';
import OrdersTab from './pages/dashboard/OrdersTab';
import AddProductTab from './pages/dashboard/AddProductTab';

const toastStyle = {
  style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authView, setAuthView] = useState('welcome');
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(() => {
    setToken('');
    localStorage.removeItem('token');
    setAuthView('welcome');
    toast('Sesión finalizada', { icon: '👋' });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, lowRes, ordRes, supRes] = await Promise.all([
        warehouseService.getProducts(),
        warehouseService.getLowStock(),
        warehouseService.getOrders(),
        warehouseService.getSuppliers(),
      ]);

      setProducts(prodRes.data);
      setLowStock(lowRes.data);
      setOrders(ordRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, activeTab, loadData]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  if (!token) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <Toaster position="top-right" toastOptions={toastStyle} />

        {authView === 'welcome' ? (
          <WelcomeView onNavigate={setAuthView} />
        ) : (
          <AuthFormView
            mode={authView}
            onSwitchMode={setAuthView}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <Toaster position="top-right" toastOptions={toastStyle} />
      <Header onLogout={handleLogout} />

      <div className="flex flex-col lg:flex-row flex-1 max-w-[1800px] mx-auto w-full p-6 lg:p-8 gap-8">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={{
            products: products.length,
            suppliers: suppliers.length,
            lowStock: lowStock.length,
            orders: orders.length,
          }}
        />

        <main className="flex-1 min-w-0 space-y-8">
          <KpiCards products={products} lowStockCount={lowStock.length} />

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              loading={loading}
              onAddClick={() => setActiveTab('add')}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersTab suppliers={suppliers} onCreated={loadData} />
          )}

          {activeTab === 'alerts' && <AlertsTab lowStock={lowStock} />}

          {activeTab === 'orders' && <OrdersTab orders={orders} />}

          {activeTab === 'add' && (
            <AddProductTab
              suppliers={suppliers}
              onCreated={() => {
                setActiveTab('products');
                loadData();
              }}
              onCancel={() => setActiveTab('products')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;