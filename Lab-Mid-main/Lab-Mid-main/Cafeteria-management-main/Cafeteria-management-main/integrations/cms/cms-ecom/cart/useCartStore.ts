import { create } from "zustand";
import type { Discounts, MenuItems } from "@/entities";
import { BaseCrudService } from "@/integrations";
import { useAuthStore } from "@/store/authStore";
import type { PaymentMethod } from "@/lib/payments";
import { createOrderWorkflow } from "@/lib/orderWorkflow";

const CART_STORAGE_KEY = "cafeteria-management-cart-v1";

export interface CartItem {
  id: string;
  collectionId: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AddToCartInput {
  collectionId: string;
  itemId: string;
  quantity?: number;
}

export interface CheckoutInput {
  paymentMethod: PaymentMethod;
  notes?: string;
  transferReference?: string;
  discount?: Discounts | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  addingItemId: string | null;
  isCheckingOut: boolean;
  error: string | null;
  _initialized: boolean;
}

interface CartActions {
  addToCart: (input: AddToCartInput) => Promise<void>;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  checkout: (input: CheckoutInput) => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  _fetchCart: () => Promise<void>;
}

type CartStore = CartState & { actions: CartActions };

const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

const persistItems = (items: CartItem[]) => {
  if (!canUseStorage()) return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const loadPersistedItems = (): CartItem[] => {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildCartItem = (item: MenuItems, input: AddToCartInput): CartItem => ({
  id: `${input.collectionId}:${input.itemId}`,
  collectionId: input.collectionId,
  itemId: input.itemId,
  name: item.itemName || "Unknown Item",
  price: item.itemPrice || 0,
  quantity: input.quantity || 1,
  image: item.itemImage || undefined,
});

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  addingItemId: null,
  isCheckingOut: false,
  error: null,
  _initialized: false,
  actions: {
    _fetchCart: async () => {
      if (get()._initialized) return;
      set({ isLoading: true, error: null });
      const items = loadPersistedItems();
      set({ items, isLoading: false, _initialized: true });
    },
    addToCart: async (input: AddToCartInput) => {
      set({ addingItemId: input.itemId, error: null });
      try {
        const existing = get().items.find((item) => item.itemId === input.itemId);
        if (existing) {
          const updatedItems = get().items.map((item) =>
            item.itemId === input.itemId
              ? { ...item, quantity: item.quantity + (input.quantity || 1) }
              : item
          );
          persistItems(updatedItems);
          set({ items: updatedItems });
          return;
        }

        const menuItem = await BaseCrudService.getById<MenuItems>(input.collectionId, input.itemId);
        if (!menuItem) {
          throw new Error("Item not found.");
        }

        const updatedItems = [...get().items, buildCartItem(menuItem, input)];
        persistItems(updatedItems);
        set({ items: updatedItems });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Failed to add to cart" });
      } finally {
        set({ addingItemId: null });
      }
    },
    removeFromCart: (item: CartItem) => {
      const updatedItems = get().items.filter((entry) => entry.id !== item.id);
      persistItems(updatedItems);
      set({ items: updatedItems });
    },
    updateQuantity: (item: CartItem, quantity: number) => {
      const updatedItems =
        quantity <= 0
          ? get().items.filter((entry) => entry.id !== item.id)
          : get().items.map((entry) => (entry.id === item.id ? { ...entry, quantity } : entry));
      persistItems(updatedItems);
      set({ items: updatedItems });
    },
    clearCart: () => {
      persistItems([]);
      set({ items: [], error: null });
    },
    checkout: async (input: CheckoutInput) => {
      set({ isCheckingOut: true, error: null });
      try {
        const authUser = useAuthStore.getState().user;
        const cartItems = get().items;

        if (!authUser) {
          throw new Error("Please sign in before placing an order.");
        }
        if (cartItems.length === 0) {
          throw new Error("Your cart is empty.");
        }

        await createOrderWorkflow({
          userId: authUser._id,
          lineItems: cartItems.map((item) => ({
            menuItemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          paymentMethod: input.paymentMethod,
          notes: input.notes,
          transferReference: input.transferReference,
          discount: input.discount,
          source: "web",
        });

        persistItems([]);
        set({ items: [], isOpen: false, isCheckingOut: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Checkout failed",
          isCheckingOut: false,
        });
      }
    },
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
  },
}));

export const useCart = () => {
  const store = useCartStore();

  if (!store._initialized && !store.isLoading) {
    store.actions._fetchCart();
  }

  const itemCount = store.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = store.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items: store.items,
    itemCount,
    totalPrice,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    addingItemId: store.addingItemId,
    isCheckingOut: store.isCheckingOut,
    error: store.error,
    actions: store.actions,
  };
};
