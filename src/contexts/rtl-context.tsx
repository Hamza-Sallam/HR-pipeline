"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLanguage } from "./language-context";

interface RTLContextType {
  isRTL: boolean;
  dir: "ltr" | "rtl";
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export function RTLProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  return (
    <RTLContext.Provider value={{ isRTL, dir }}>
      <div dir={dir} className={isRTL ? "rtl" : "ltr"}>
        {children}
      </div>
    </RTLContext.Provider>
  );
}

export function useRTL() {
  const context = useContext(RTLContext);
  if (context === undefined) {
    throw new Error("useRTL must be used within an RTLProvider");
  }
  return context;
} 