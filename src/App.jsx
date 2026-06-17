import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AuthSync from './components/auth/AuthSync';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomTabBar from './components/layout/BottomTabBar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ToastContainer from './components/ui/Toast';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Auth from './pages/Auth';
import Sellers from './pages/Sellers';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Referrals from './pages/Referrals';
import About from './pages/About';
import NotFound from './pages/NotFound';

/** Scrolls to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <BottomTabBar />
      <Footer />
    </div>
  );
}

function DashboardShell({ children }) {
  return <div className="min-h-screen">{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <AuthSync />
          <ToastContainer />
          <ScrollToTop />
          <Routes>
            {/* Public */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/sellers" element={<MainLayout><Sellers /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />

            {/* Auth */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />

            {/* Buyer protected */}
            <Route path="/checkout" element={<ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><MainLayout><Subscription /></MainLayout></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><MainLayout><Referrals /></MainLayout></ProtectedRoute>} />

            {/* Dashboards */}
            <Route path="/seller" element={
              <ProtectedRoute roles={['seller', 'admin']}>
                <DashboardShell><SellerDashboard /></DashboardShell>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <DashboardShell><AdminDashboard /></DashboardShell>
              </ProtectedRoute>
            } />

            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
