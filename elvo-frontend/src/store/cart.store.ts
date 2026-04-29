import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  variantId: string;
  productName: string;
  sku: string;
  size?: string;
  color?: string;
  priceInCents: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  clear: () => void;
  totalInCents: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: item =>
        set(state => {
          const existing = state.items.find(i => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: variantId =>
        set(state => ({ items: state.items.filter(i => i.variantId !== variantId) })),
      updateQty: (variantId, qty) =>
        set(state => ({
          items: state.items.map(i => (i.variantId === variantId ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
      totalInCents: () => get().items.reduce((s, i) => s + i.priceInCents * i.quantity, 0),
    }),
    { name: 'elvo-cart' }
  )
);
