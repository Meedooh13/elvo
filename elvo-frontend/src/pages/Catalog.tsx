import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/axios';

const Catalog: React.FC = () => {
  const [params] = useSearchParams();
  const category = params.get('category') ?? '';
  const search = params.get('search') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, search],
    queryFn: () =>
      api.get('/products', { params: { categorySlug: category, search } }).then(r => r.data),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-surface rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-8">Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.items?.map((product: any) => (
          <Link key={product.id} to={`/product/${product.slug}`} className="group">
            <div className="aspect-[3/4] bg-surface rounded-xl overflow-hidden mb-3">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <p className="font-semibold text-sm">{product.name}</p>
            <p className="text-accent text-sm font-bold">
              EGP {(Math.min(...product.variants.map((v: any) => v.priceInCents)) / 100).toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Catalog;
