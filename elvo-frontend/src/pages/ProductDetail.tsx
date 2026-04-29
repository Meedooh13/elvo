import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cart.store';
import api from '../lib/axios';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore(s => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-32">Loading...</div>;
  if (!product) return <div className="text-center py-32">Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedVariant) return alert('Please select a size');
    addItem({
      variantId: selectedVariant.id,
      productName: product.name,
      sku: selectedVariant.sku,
      size: selectedVariant.size,
      color: selectedVariant.color,
      priceInCents: selectedVariant.priceInCents,
      quantity: 1,
      image: product.images?.[0] ?? '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
      <div className="aspect-square bg-surface rounded-2xl overflow-hidden">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
          {product.category?.name}
        </p>
        <h1 className="text-4xl font-black mb-4">{product.name}</h1>
        <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>

        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: any) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-all
                  ${selectedVariant?.id === v.id
                    ? 'border-accent bg-accent text-white'
                    : 'border-[var(--border)] hover:border-accent'
                  } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {v.size ?? v.sku}
              </button>
            ))}
          </div>
        </div>

        <p className="text-3xl font-black mb-8">
          EGP {selectedVariant
            ? (selectedVariant.priceInCents / 100).toFixed(2)
            : (Math.min(...product.variants.map((v: any) => v.priceInCents)) / 100).toFixed(2)
          }
        </p>

        <Button size="lg" onClick={handleAddToCart}>
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </Button>
      </div>
    </main>
  );
};

export default ProductDetail;
