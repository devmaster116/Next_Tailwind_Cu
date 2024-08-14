"use client";
import { createContext, useState, ReactNode, useContext } from "react";

interface BannerContextType {
  banner: Boolean | null;
  setBanner: (any:null) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [banner, setBanner] = useState<any | null>(null);

  return (
    <BannerContext.Provider value={{ banner, setBanner }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error("useBaner must be used within a BannerProvider");
  }
  return context;
};
