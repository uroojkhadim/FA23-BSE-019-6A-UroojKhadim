import { create } from "zustand";

export const DEFAULT_CURRENCY = "PKR";

const CURRENCY_STORAGE_KEY = "cafeteria-management-currency-v1";

export function formatPrice(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: DEFAULT_CURRENCY,
    }).format(amount);
  }
}

interface CurrencyState {
  currency: string | null;
  isLoading: boolean;
  error: string | null;
}

interface CurrencyActions {
  setCurrency: (currency: string) => void;
}

type CurrencyStore = CurrencyState & { actions: CurrencyActions };

const readCurrency = () => {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  return stored || DEFAULT_CURRENCY;
};

const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: readCurrency(),
  isLoading: false,
  error: null,
  actions: {
    setCurrency: (currency: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
      }
      set({ currency });
    },
  },
}));

export const useCurrency = () => {
  const store = useCurrencyStore();
  return {
    currency: store.currency,
    isLoading: store.isLoading,
    error: store.error,
    setCurrency: store.actions.setCurrency,
  };
};
