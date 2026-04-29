import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

const Home = lazy(() => import('../pages/Home'));
const Catalog = lazy(() => import('../pages/Catalog'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const LoginForm = lazy(() => import('../features/auth/LoginForm').then(m => ({ default: m.LoginForm })));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Navbar />
    <Suspense fallback={<div className="flex justify-center items-center h-96">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
