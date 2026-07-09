import type { Project } from "@/types";

export const ecommerce: Project = {
  id: "ecommerce",
  title: "E-commerce Storefront",
  description:
    "A shopping experience with a Zustand cart store, product grid, search & filters, cart drawer and a validated checkout form.",
  difficulty: "hard",
  accent: "🛒",
  tags: ["Zustand", "State", "Forms"],
  files: [
    {
      id: "shop-types",
      path: "types/product.ts",
      language: "ts",
      difficulty: "easy",
      code: `export type Category = "electronics" | "apparel" | "home" | "books";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  rating: number;
  image: string;
  inStock: boolean;
}
`,
    },
    {
      id: "shop-format-price",
      path: "lib/format-price.ts",
      language: "ts",
      difficulty: "easy",
      code: `export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
`,
    },
    {
      id: "shop-product-card",
      path: "components/product-card.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format-price";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group rounded-xl border border-slate-200 p-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
            <Star size={12} fill="currentColor" />
            {product.rating}
          </div>
        </div>
        <span className="text-sm font-semibold">
          {formatPrice(product.price)}
        </span>
      </div>

      <button
        type="button"
        disabled={!product.inStock}
        onClick={() => addItem(product)}
        className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-sm text-white disabled:opacity-40"
      >
        {product.inStock ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  );
}
`,
    },
    {
      id: "shop-filters",
      path: "components/product-filters.tsx",
      language: "tsx",
      difficulty: "hard",
      code: `"use client";

import type { Category } from "@/types/product";

const categories: Array<{ value: Category | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "electronics", label: "Electronics" },
  { value: "apparel", label: "Apparel" },
  { value: "home", label: "Home" },
  { value: "books", label: "Books" },
];

interface FiltersProps {
  active: Category | "all";
  onChange: (value: Category | "all") => void;
  query: string;
  onQueryChange: (value: string) => void;
}

export function ProductFilters({
  active,
  onChange,
  query,
  onQueryChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search products..."
        className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm sm:max-w-xs"
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={
              active === category.value
                ? "rounded-full bg-slate-900 px-4 py-1.5 text-xs text-white"
                : "rounded-full border border-slate-200 px-4 py-1.5 text-xs text-slate-600"
            }
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
`,
    },
    {
      id: "shop-cart-store",
      path: "store/cart-store.ts",
      language: "ts",
      difficulty: "hard",
      code: `import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "cart" },
  ),
);
`,
    },
    {
      id: "shop-cart-drawer",
      path: "components/cart-drawer.tsx",
      language: "tsx",
      difficulty: "extreme",
      code: `"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format-price";

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.totalPrice());

  return (
    <div className="flex h-full w-full max-w-sm flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShoppingBag size={18} />
          Your cart
        </h2>
        <button type="button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-slate-500">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <button className="mt-4 w-full rounded-lg bg-slate-900 py-3 text-sm text-white">
          Checkout
        </button>
      </div>
    </div>
  );
}
`,
    },
    {
      id: "shop-checkout",
      path: "components/checkout-form.tsx",
      language: "tsx",
      difficulty: "extreme",
      code: `"use client";

import { useState } from "react";

interface FormState {
  email: string;
  card: string;
  name: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.email.includes("@")) {
    errors.email = "Enter a valid email";
  }
  if (values.card.replace(/\\s/g, "").length < 16) {
    errors.card = "Card number is incomplete";
  }
  if (values.name.trim().length === 0) {
    errors.name = "Name is required";
  }
  return errors;
}

export function CheckoutForm() {
  const [values, setValues] = useState<FormState>({
    email: "",
    card: "",
    name: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  function update(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      console.log("Order placed", values);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full name</label>
        <input
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 py-3 text-sm text-white"
      >
        Pay now
      </button>
    </form>
  );
}
`,
    },
  ],
};
