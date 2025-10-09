"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface SavedAddress {
  id: string;
  label: string; // e.g., Home, Work
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

interface AddressBookContextType {
  addresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
}

const AddressBookContext = createContext<AddressBookContextType | undefined>(undefined);

export const useAddressBook = (): AddressBookContextType => {
  const ctx = useContext(AddressBookContext);
  if (!ctx) throw new Error("useAddressBook must be used within AddressBookProvider");
  return ctx;
};

export const AddressBookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('buynest_addresses');
    if (raw) {
      try { setAddresses(JSON.parse(raw)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('buynest_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const id = crypto.randomUUID();
    setAddresses(prev => [{ id, ...addr }, ...prev].slice(0, 10));
  };

  const removeAddress = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));

  return (
    <AddressBookContext.Provider value={{ addresses, addAddress, removeAddress }}>
      {children}
    </AddressBookContext.Provider>
  );
};


