import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Button } from '../components/ui/Button';
import api from '../lib/axios';

interface VariantRow { sku: string; size: string; color: string; price: string; stock: string; }

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Grey', 'Navy'];

const PRESET_CATEGORIES = [
  { name: 'T-Shirts',  slug: 'tshirts' },
  { name: 'Oversized', slug: 'oversized' },
  { name: 'Hoodies',   slug: 'hoodies' },
  { name: 'Caps',      slug: 'caps' },
  { name: 'Pants',     slug: 'pants' },
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyForm = () => ({
  name: '',
  categoryName: 'Jackets',
  description: '',
  imageUrl: '',
  variants: [{ sku: '', size: 'M', color: 'Black', price: '', stock: '' }] as VariantRow[],
});

const AdminPanel: React.FC = () => {
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [showForm, setShowForm]       = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [form, setForm]               = useState(emptyForm());
  const [activeTab, setActiveTab]     = useState<'products' | 'orders'>('products');
  const [saveError, setSaveError]     = useState('');

  const headers = { Authorization: `Bearer ${accessToken}` };

  if (!user || user.role !== 'ADMIN') { navigate('/'); return null; }

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products?limit=100', { headers }).then(r => r.data),
  });

  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/orders/admin/all', { headers }).then(r => r.data),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories', { headers }).then(r => r.data).catch(() => []),
  });

  // ── Mutations ────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      // 1. Find or create category automatically
      let category = categoriesData?.find((c: any) =>
        c.name.toLowerCase() === payload.categoryName.toLowerCase()
      );
      if (!category) {
        const { data } = await api.post('/categories', {
          name: payload.categoryName,
          slug: slugify(payload.categoryName),
        }, { headers });
        category = data;
      }

      // 2. Build product payload — slug and SKUs generated automatically
      const productPayload = {
        name: payload.name,
        slug: slugify(payload.name) + '-' + Date.now(),
        description: payload.description,
        categoryId: category.id,
        images: payload.imageUrl ? [payload.imageUrl] : [],
        isActive: true,
        variants: payload.variants
          .filter((v: VariantRow) => v.price && v.stock)
          .map((v: VariantRow) => ({
            sku: `${slugify(payload.name).toUpperCase()}-${v.size}-${v.color.toUpperCase()}-${Date.now()}`,
            size: v.size,
            color: v.color,
            priceInCents: Math.round(parseFloat(v.price) * 100),
            stock: parseInt(v.stock),
          })),
      };

      return api.post('/products', productPayload, { headers });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      setShowForm(false);
      setForm(emptyForm());
      setSaveError('');
    },
    onError: (err: any) => {
      setSaveError(err.response?.data?.message ?? 'Failed to save. Please check all required fields.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`, { headers }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    if (!form.name.trim()) return setSaveError('Product name is required.');
    if (!form.description.trim()) return setSaveError('Description is required.');
    const validVariants = form.variants.filter(v => v.price && v.stock);
    if (!validVariants.length) return setSaveError('Add at least one variant with price and stock.');
    saveMutation.mutate(form);
  };

  const updateVariant = (i: number, field: keyof VariantRow, value: string) => {
    const updated = [...form.variants];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, variants: updated });
  };

  const removeVariant = (i: number) => {
    if (form.variants.length === 1) return;
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    AWAITING_PAYMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    DELIVERED: 'bg-green-200 text-green-900',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">Store Management</p>
          <h1 className="text-4xl font-black tracking-tighter">Admin Panel</h1>
        </div>
        {activeTab === 'products' && (
          <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm()); setSaveError(''); }}>
            + Add New Product
          </Button>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: productsData?.total ?? '—' },
          { label: 'Total Orders', value: ordersData?.length ?? '—' },
          { label: 'Paid Orders', value: ordersData?.filter((o: any) => o.status === 'PAID').length ?? '—' },
          { label: 'Revenue (EGP)', value: ordersData
            ? (ordersData.filter((o: any) => o.status === 'PAID').reduce((s: number, o: any) => s + o.totalInCents, 0) / 100).toFixed(0)
            : '—' },
        ].map(stat => (
          <div key={stat.label} className="p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--surface)] rounded-xl w-fit mb-8 border border-[var(--border)]">
        {(['products', 'orders'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all
              ${activeTab === tab
                ? 'bg-[var(--bg-primary)] shadow-sm text-accent border border-[var(--border)]'
                : 'text-gray-500 hover:text-[var(--text-primary)]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── PRODUCTS GRID ── */}
      {activeTab === 'products' && (
        <>
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-[var(--surface)] animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {productsData?.items?.map((product: any) => (
                <div key={product.id}
                  className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden
                             hover:border-accent transition-all duration-200 hover:shadow-lg group">
                  <div className="aspect-square bg-[var(--surface-2)] relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">👕</div>
                    )}
                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full
                      ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {product.isActive ? '● Live' : '● Hidden'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
                    <p className="text-accent font-black">
                      {product.variants?.length
                        ? `EGP ${(Math.min(...product.variants.map((v: any) => v.priceInCents)) / 100).toFixed(2)}`
                        : 'No variants'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 mb-4">
                      {product.variants?.reduce((s: number, v: any) => s + v.stock, 0) ?? 0} items in stock
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { alert('Edit coming soon — use Add Product for now'); }}
                        className="flex-1 text-xs font-semibold py-2 rounded-lg border border-[var(--border)]
                                   hover:border-accent hover:text-accent transition-all">
                        Edit
                      </button>
                      <button
                        onClick={() => { if (window.confirm(`Deactivate "${product.name}"?`)) deleteMutation.mutate(product.id); }}
                        className="flex-1 text-xs font-semibold py-2 rounded-lg border border-red-200 text-red-500
                                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add product card */}
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm()); setSaveError(''); }}
                className="min-h-[280px] rounded-2xl border-2 border-dashed border-[var(--border)]
                           hover:border-accent transition-all flex flex-col items-center justify-center
                           gap-3 text-gray-400 hover:text-accent group">
                <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center
                                text-3xl group-hover:scale-110 transition-transform">+</div>
                <span className="text-sm font-semibold">Add New Product</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ── ORDERS TABLE ── */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl border border-[var(--border)] overflow-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-[var(--surface)] border-b border-[var(--border)]">
                {['Order', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordersData?.map((order: any) => (
                <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{order.user?.firstName}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 font-bold text-accent">EGP {(order.totalInCents / 100).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loadingOrders && !ordersData?.length && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-medium">No orders yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── ADD PRODUCT MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)] shadow-2xl my-8">

            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-black">New Product</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 text-2xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Product Name <span className="text-accent">*</span></label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ferrari 2025 Team Jacket"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]
                             text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Category dropdown — no UUID needed */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Category <span className="text-accent">*</span></label>
                <select
                  value={form.categoryName}
                  onChange={e => setForm({ ...form, categoryName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]
                             text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                  {PRESET_CATEGORIES.map(c => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Description <span className="text-accent">*</span></label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]
                             text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]
                             text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="preview"
                    className="mt-2 h-24 w-24 object-cover rounded-xl border border-[var(--border)]"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold">
                    Sizes & Prices <span className="text-accent">*</span>
                  </label>
                  <button type="button"
                    onClick={() => setForm({ ...form, variants: [...form.variants, { sku: '', size: 'M', color: 'Black', price: '', stock: '' }] })}
                    className="text-xs font-semibold text-accent hover:underline">
                    + Add Size
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Column headers */}
                  <div className="grid grid-cols-12 gap-2 px-1">
                    <span className="col-span-3 text-xs text-gray-400 font-medium">Size</span>
                    <span className="col-span-3 text-xs text-gray-400 font-medium">Color</span>
                    <span className="col-span-3 text-xs text-gray-400 font-medium">Price (EGP)</span>
                    <span className="col-span-2 text-xs text-gray-400 font-medium">Stock</span>
                    <span className="col-span-1" />
                  </div>

                  {form.variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[var(--surface)] p-2 rounded-xl border border-[var(--border)]">
                      {/* Size */}
                      <select value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)}
                        className="col-span-3 px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-accent">
                        {SIZES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      {/* Color */}
                      <select value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)}
                        className="col-span-3 px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-accent">
                        {COLORS.map(c => <option key={c}>{c}</option>)}
                      </select>
                      {/* Price */}
                      <input type="number" min="0" step="0.01" placeholder="299"
                        value={v.price}
                        onChange={e => updateVariant(i, 'price', e.target.value)}
                        className="col-span-3 px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                      {/* Stock */}
                      <input type="number" min="0" placeholder="10"
                        value={v.stock}
                        onChange={e => updateVariant(i, 'stock', e.target.value)}
                        className="col-span-2 px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                      {/* Remove */}
                      <button type="button" onClick={() => removeVariant(i)}
                        className="col-span-1 text-gray-300 hover:text-red-500 transition-colors text-lg leading-none text-center">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {saveError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
                  {saveError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="submit" loading={saveMutation.isPending} className="flex-1 py-3">
                  Create Product
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1 py-3">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPanel;
