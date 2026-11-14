"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // unique item id (productId + size + color)
  productId: string;
  title: string;
  slug: string;
  price: number; // in INR
  salePrice?: number | null;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface AppliedPromo {
  code: string;
  discountPercentage: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemOptions: (id: string, newSize: string, newColor: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promo: AppliedPromo | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PROMO_CODES: Record<string, number> = {
  HAII10: 10,
  AFTERDARK: 15,
  DROP20: 20,
  FIRSTDROP: 10
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("hw_cart_items");
      if (savedItems) setItems(JSON.parse(savedItems));
      const savedPromo = localStorage.getItem("hw_cart_promo");
      if (savedPromo) setPromo(JSON.parse(savedPromo));
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hw_cart_items", JSON.stringify(items));
      if (promo) {
        localStorage.setItem("hw_cart_promo", JSON.stringify(promo));
      } else {
        localStorage.removeItem("hw_cart_promo");
      }
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, promo, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    const id = `${newItem.productId}_${newItem.size}_${newItem.color}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, { ...newItem, id }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const updateItemOptions = (id: string, newSize: string, newColor: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newId = `${item.productId}_${newSize}_${newColor}`;
      const filtered = prev.filter((i) => i.id !== id);
      const existingWithNewId = filtered.find((i) => i.id === newId);
      if (existingWithNewId) {
        return filtered.map((i) =>
          i.id === newId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...filtered, { ...item, id: newId, size: newSize, color: newColor }];
    });
  };

  const clearCart = () => {
    setItems([]);
    setPromo(null);
  };

  const applyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      const discountPercentage = PROMO_CODES[cleanCode];
      const applied = { code: cleanCode, discountPercentage };
      setPromo(applied);
      return { success: true, message: `Code ${cleanCode} applied! ${discountPercentage}% OFF` };
    }
    return { success: false, message: "Invalid or expired promotional code." };
  };

  const removePromo = () => setPromo(null);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discount = promo ? Math.round((subtotal * promo.discountPercentage) / 100) : 0;
  // Free shipping above ₹2,999, else flat ₹150
  const shipping = subtotal === 0 || subtotal >= 2999 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        updateItemOptions,
        clearCart,
        itemCount,
        subtotal,
        discount,
        shipping,
        total,
        promo,
        applyPromo,
        removePromo
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
