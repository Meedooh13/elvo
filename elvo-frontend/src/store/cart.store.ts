import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productName: string;
  size: string;
  color: string;
  priceInCents: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  userId: string | null;
  setUserId: (id: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,

      setUserId: (userId) => {
        if (userId !== get().userId) {
          set({ items: [], userId });
        }
      },

      addItem: (item) => set((s) => {
        const existing = s.items.find(i => i.variantId === item.variantId);
        if (existing) {
          return {
            items: s.items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return { items: [...s.items, item] };
      }),

      removeItem: (variantId) =>
        set((s) => ({ items: s.items.filter(i => i.variantId !== variantId) })),

      updateQty: (variantId, quantity) =>
        set((s) => ({
          items: quantity <= 0
            ? s.items.filter(i => i.variantId !== variantId)
            : s.items.map(i => i.variantId === variantId ? { ...i, quantity } : i),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'elvo-cart' }
  )
);
