"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  wishlistIds: string[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isWishlisted: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Check current session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            fetchWishlist();
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    }

    // Also load local wishlist for guests
    const savedWishlist = localStorage.getItem("hw_wishlist_ids");
    if (savedWishlist) {
      try {
        setWishlistIds(JSON.parse(savedWishlist));
      } catch {}
    }

    checkAuth();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(data.productIds || []);
      }
    } catch {}
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user);
      fetchWishlist();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    const isPresent = wishlistIds.includes(productId);
    const updated = isPresent
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    setWishlistIds(updated);
    localStorage.setItem("hw_wishlist_ids", JSON.stringify(updated));

    if (user) {
      try {
        await fetch("/api/wishlist", {
          method: isPresent ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } catch {}
    }

    return !isPresent;
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "ADMIN",
        wishlistIds,
        login,
        register,
        logout,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
