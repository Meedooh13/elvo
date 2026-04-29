import React, { useState } from 'react';
import { useCartStore } from '../../store/cart.store';
import { Button } from '../../components/ui/Button';
import { PaymobIframe } from './PaymobIframe';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  const { items, totalInCents, clear } = useCartStore();
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addressId, setAddressId] = useState('');

  if (!accessToken) {
    navigate('/login');
    return null;
  }

  const handleCheckout = async () => {
    if (!addressId) return alert('Please select an address');
    setLoading(true);
    try {
      // 1. Create order
      const orderPayload = {
        addressId,
        items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
      };
      const { data: order } = await api.post('/orders', orderPayload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // 2. Get Paymob iframe URL
      const { data: payment } = await api.post(`/payments/checkout/${order.id}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setIframeUrl(payment.iframeUrl);
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClose = () => {
    setIframeUrl(null);
    clear();
    navigate('/orders');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Checkout</h1>

      <div className="bg-surface rounded-xl border border-[var(--border)] p-6 mb-6">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        {items.map(item => (
          <div key={item.variantId} className="flex justify-between text-sm py-2 border-b border-[var(--border)]">
            <span>{item.productName} × {item.quantity}</span>
            <span>EGP {((item.priceInCents * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4 text-lg">
          <span>Total</span>
          <span>EGP {(totalInCents() / 100).toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Address ID</label>
        <input
          value={addressId}
          onChange={e => setAddressId(e.target.value)}
          placeholder="Paste your address ID from profile"
          className="w-full px-4 py-2.5 rounded-md border border-[var(--border)] bg-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
        />
      </div>

      <Button size="lg" loading={loading} className="w-full" onClick={handleCheckout}>
        Proceed to Payment
      </Button>

      {iframeUrl && <PaymobIframe iframeUrl={iframeUrl} onClose={handlePaymentClose} />}
    </div>
  );
};
