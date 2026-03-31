import { useCartStore } from "./cart/useCartStore";

export async function buyNow(
  items: Array<{ collectionId: string; itemId: string; quantity?: number }>
): Promise<void> {
  if (items.length === 0) {
    throw new Error("At least one item is required for checkout");
  }

  for (const item of items) {
    await useCartStore.getState().actions.addToCart(item);
  }

  useCartStore.getState().actions.openCart();
}
