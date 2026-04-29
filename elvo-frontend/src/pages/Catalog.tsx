import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/axios';

const CATEGORIES = [
  { label: 'All',       value: '' },
  { label: 'T-Shirts',  value: 'tshirts' },
  { label: 'Oversized', value: 'oversized' },
  { label: 'Hoodies',   value: 'hoodies' },
  { label: 'Caps',      value: 'caps' },
];

const Catalog: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? '';
  const search   = params.get('search') ?? '';
  const [searchInput, setSearchInput] = useState(search);

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, search],
    queryFn: () => api.get('/products', { params: { categorySlug: category || undefined, search: search || undefined } }).then(r => r.data),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ category, search: searchInput });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Elvo Store</p>
        <h1 className="font-display text-6xl mb-6">COLLECTION</h1>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm mb-6">
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)]
                       text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-full text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all">
            Search
          </button>
        </form>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setParams({ category: cat.value, search })}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                ${category === cat.value
                  ? 'bg-accent text-white shadow-[0_0_16px_var(--accent-glow)]'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-accent hover:text-accent'}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--surface)] animate-pulse" />)}
        </div>
      ) : (
        <>
          <p className="text-[var(--text-secondary)] text-sm mb-5">{data?.total ?? 0} products</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data?.items?.map((product: any) => (
              <Link key={product.id} to={`/product/${product.slug}`} className="group block">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)]
                                group-hover:border-accent transition-all duration-300 group-hover:shadow-[0_8px_30px_var(--accent-glow)] mb-3 relative">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-[var(--border)]"><svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-xs font-semibold bg-accent px-3 py-1.5 rounded-full">View Product</span>
                  </div>
                </div>
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <p className="text-xs text-[var(--text-secondary)] mb-1">{product.category?.name}</p>
                <p className="text-accent font-bold text-sm">
                  {product.variants?.length
                    ? `EGP ${(Math.min(...product.variants.map((v: any) => v.priceInCents)) / 100).toFixed(2)}`
                    : 'Coming Soon'}
                </p>
              </Link>
            ))}
          </div>
          {data?.items?.length === 0 && (
            <div className="text-center py-24 text-[var(--text-secondary)]">
              <p className="font-display text-4xl mb-2">NO PRODUCTS YET</p>
              <p className="text-sm">Check back soon or add some from the admin panel.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Catalog;
