"use client";

import { createContext, useState, ReactNode, useContext } from "react";
import { Kitchen } from "../src/types";

interface KitchenContextType {
  kitchen: Kitchen | null;
  setKitchen: (kitchen: Kitchen | null) => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const KitchenProvider = ({ children }: { children: ReactNode }) => {
  const [kitchen, setKitchen] = useState<Kitchen | null>(null);

  return (
    <KitchenContext.Provider value={{ kitchen, setKitchen }}>
      {children}
    </KitchenContext.Provider>
  );
};

export const useKitchen = () => {
  const context = useContext(KitchenContext);
  if (context === undefined) {
    throw new Error("useKitchen must be used within a UserProvider");
  }
  return context;
};
