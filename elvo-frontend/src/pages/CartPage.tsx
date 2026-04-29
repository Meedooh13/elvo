import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart.store';
import { Button } from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQty, totalInCents } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-5xl mb-6">🛒</p>
        <h2 className="text-2xl font-black mb-4">Your cart is empty</h2>
        <Link to="/catalog"><Button>Browse Collection</Button></Link>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Your Cart</h1>
      <div className="flex flex-col gap-4 mb-8">
        {items.map(item => (
          <div key={item.variantId} className="flex gap-4 p-4 bg-surface rounded-xl border border-[var(--border)]">
            {item.image && (
              <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded-lg" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{item.productName}</p>
              <p className="text-sm text-gray-500">{item.size} {item.color}</p>
              <p className="text-accent font-bold mt-1">EGP {(item.priceInCents / 100).toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => removeItem(item.variantId)} className="text-gray-400 hover:text-red-500 text-sm">
                Remove
              </button>
              <select
                value={item.quantity}
                onChange={e => updateQty(item.variantId, Number(e.target.value))}
                className="border border-[var(--border)] rounded-md px-2 py-1 text-sm bg-primary"
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-6 bg-surface rounded-xl border border-[var(--border)]">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-black">EGP {(totalInCents() / 100).toFixed(2)}</p>
        </div>
        <Link to="/checkout"><Button size="lg">Checkout</Button></Link>
      </div>
    </main>
  );
};

export default CartPage;
