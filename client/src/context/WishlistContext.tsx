import React, { createContext, useContext, useEffect, useState } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  imageUrl?: string;
  price?: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = (): WishlistContextType => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("buynest_wishlist");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buynest_wishlist", JSON.stringify(items));
  }, [items]);

  const isInWishlist = (id: string) => items.some(i => i.id === id);

  const toggleWishlist = (item: WishlistItem) => {
    setItems(prev => prev.some(i => i.id === item.id)
      ? prev.filter(i => i.id !== item.id)
      : [...prev, item]
    );
  };

  const removeFromWishlist = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};


