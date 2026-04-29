import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { Button } from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const total = items.reduce((s, i) => s + i.priceInCents * i.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-5xl mb-4 text-[var(--text-secondary)]">YOUR CART IS EMPTY</p>
        <p className="text-[var(--text-secondary)] mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/catalog">
          <Button size="lg">Browse Collection</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">Review Your Order</p>
          <h1 className="font-display text-5xl">YOUR CART</h1>
        </div>
        <button onClick={clearCart} className="text-sm text-[var(--text-secondary)] hover:text-red-500 transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">

        {/* Items */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {items.map(item => (
            <div key={item.variantId}
              className="flex gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 items-center">
              {/* Image */}
              <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border)]">
                {item.image
                  ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[var(--border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.productName}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.size} · {item.color}</p>
                <p className="text-accent font-bold text-sm mt-1">
                  EGP {(item.priceInCents / 100).toFixed(2)}
                </p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQty(item.variantId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center
                             hover:border-accent hover:text-accent transition-all text-lg leading-none">
                  −
                </button>
                <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.variantId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center
                             hover:border-accent hover:text-accent transition-all text-lg leading-none">
                  +
                </button>
              </div>

              {/* Subtotal + remove */}
              <div className="text-right shrink-0">
                <p className="font-bold text-sm">EGP {((item.priceInCents * item.quantity) / 100).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-xs text-[var(--text-secondary)] hover:text-red-500 transition-colors mt-1">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sticky top-24">
          <h2 className="font-bold text-lg mb-5">Order Summary</h2>

          <div className="flex flex-col gap-3 mb-5 text-sm">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
              <span>EGP {(total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4 mb-5">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-black text-accent">EGP {(total / 100).toFixed(2)}</span>
            </div>
          </div>

          {user ? (
            <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login">
                <Button size="lg" className="w-full">Sign In to Checkout</Button>
              </Link>
              <p className="text-center text-xs text-[var(--text-secondary)]">
                or <Link to="/register" className="text-accent hover:underline">create an account</Link>
              </p>
            </div>
          )}

          <Link to="/catalog" className="block text-center text-sm text-[var(--text-secondary)] hover:text-accent mt-4 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
