import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import api from '../../lib/axios';

interface AddressForm {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  governorate: string;
}

const GOVERNORATES = [
  'Cairo', 'Alexandria', 'Giza', 'Qalyubia', 'Gharbia',
  'Dakahlia', 'Sharqia', 'Monufia', 'Beheira', 'Kafr El Sheikh',
  'Damietta', 'Port Said', 'Ismailia', 'Suez', 'North Sinai',
  'South Sinai', 'Matrouh', 'Luxor', 'Aswan', 'Qena', 'Sohag',
  'Asyut', 'Minya', 'Beni Suef', 'Fayoum', 'Red Sea', 'New Valley',
];

export const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  const [addr, setAddr] = useState<AddressForm>({
    label: 'Home', fullName: '', phone: '',
    line1: '', line2: '', city: '', governorate: 'Cairo',
  });

  const total = items.reduce((s, i) => s + i.priceInCents * i.quantity, 0);

  const mutation = useMutation({
    mutationFn: async () => {
      const headers = { Authorization: `Bearer ${accessToken}` };

      // 1. Create address on the fly
      const { data: address } = await api.post('/users/me/addresses', {
        label: addr.label,
        fullName: addr.fullName,
        phone: addr.phone,
        line1: addr.line1,
        line2: addr.line2 || undefined,
        city: addr.city,
        governorate: addr.governorate,
        country: 'Egypt',
      }, { headers });

      // 2. Place order with the created address id
      const { data: order } = await api.post('/orders', {
        addressId: address.id,
        items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
      }, { headers });

      // 3. Init Paymob payment
      const { data: payment } = await api.post('/payments/initiate', { orderId: order.id }, { headers });
      return payment;
    },
    onSuccess: (data) => {
      clearCart();
      if (data.iframeUrl) {
        window.location.href = data.iframeUrl;
      } else {
        navigate('/orders');
      }
    },
  });

  const field = (key: keyof AddressForm, label: string, required = true, placeholder = '') => (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">
        {label}{required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <input
        value={addr[key]}
        onChange={e => setAddr({ ...addr, [key]: e.target.value })}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]
                   focus:outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
      />
    </div>
  );

  if (!items.length) {
    navigate('/cart'); return null;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Step 2 of 2</p>
        <h1 className="font-display text-5xl">CHECKOUT</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">

        {/* ADDRESS FORM */}
        <div className="lg:col-span-3 bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
          <h2 className="font-bold text-lg mb-6">Delivery Address</h2>
          <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">Address Label</label>
                <select value={addr.label} onChange={e => setAddr({ ...addr, label: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-accent text-sm">
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              {field('fullName', 'Full Name', true, 'Ahmed Mohamed')}
            </div>

            {field('phone', 'Phone Number', true, '01xxxxxxxxx')}
            {field('line1', 'Street Address', true, 'Building 5, El Nasr Street')}
            {field('line2', 'Apartment / Floor', false, 'Apt 3, 2nd Floor')}

            <div className="grid grid-cols-2 gap-4">
              {field('city', 'City / District', true, 'Maadi')}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">Governorate<span className="text-accent ml-0.5">*</span></label>
                <select value={addr.governorate} onChange={e => setAddr({ ...addr, governorate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-accent text-sm">
                  {GOVERNORATES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {mutation.isError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
                Something went wrong. Please check your details and try again.
              </div>
            )}

            <Button type="submit" size="lg" loading={mutation.isPending} className="mt-2 w-full">
              Place Order & Pay
            </Button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-2 bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sticky top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="flex flex-col gap-3 mb-4">
            {items.map(item => (
              <div key={item.variantId} className="flex justify-between items-start gap-2 text-sm">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-[var(--text-secondary)] text-xs">{item.size} · {item.color} · x{item.quantity}</p>
                </div>
                <span className="font-semibold shrink-0">EGP {((item.priceInCents * item.quantity) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">Subtotal</span>
            <span className="text-xl font-black text-accent">EGP {(total / 100).toFixed(2)}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-3">Free shipping on all orders in Egypt.</p>
        </div>
      </div>
    </main>
  );
};
