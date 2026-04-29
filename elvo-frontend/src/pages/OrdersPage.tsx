import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  AWAITING_PAYMENT: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-200 text-green-900',
  CANCELLED: 'bg-red-100 text-red-800',
};

const OrdersPage: React.FC = () => {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  if (!accessToken) { navigate('/login'); return null; }

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () =>
      api.get('/orders', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-32">Loading orders...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">My Orders</h1>
      {data?.length === 0 && <p className="text-gray-500">No orders yet.</p>}
      <div className="flex flex-col gap-4">
        {data?.map((order: any) => (
          <div key={order.id} className="p-6 bg-surface rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] ?? 'bg-gray-100'}`}>
                {order.status}
              </span>
            </div>
            <p className="font-semibold">EGP {(order.totalInCents / 100).toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(order.createdAt).toLocaleDateString('en-EG')}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default OrdersPage;
