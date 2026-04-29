import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

const Home         = lazy(() => import('../pages/Home'));
const Catalog      = lazy(() => import('../pages/Catalog'));
const ProductDetail= lazy(() => import('../pages/ProductDetail'));
const CartPage     = lazy(() => import('../pages/CartPage'));
const OrdersPage   = lazy(() => import('../pages/OrdersPage'));
const AdminPanel   = lazy(() => import('../pages/AdminPanel'));
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const LoginForm    = lazy(() => import('../features/auth/LoginForm').then(m => ({ default: m.LoginForm })));
const RegisterForm = lazy(() => import('../features/auth/RegisterForm').then(m => ({ default: m.RegisterForm })));

const Loader = () => (
  <div className="flex items-center justify-center h-96">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Navbar />
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/catalog"   element={<Catalog />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart"      element={<CartPage />} />
        <Route path="/checkout"  element={<CheckoutPage />} />
        <Route path="/login"     element={<LoginForm />} />
        <Route path="/register"  element={<RegisterForm />} />
        <Route path="/orders"    element={<OrdersPage />} />
        <Route path="/admin"     element={<AdminPanel />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
