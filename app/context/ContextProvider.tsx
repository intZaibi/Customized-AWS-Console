"use client";

import { Theme } from "@/utils/types";
import { createContext, useState } from "react";

export const Context = createContext<{theme: Theme, setTheme: React.Dispatch<React.SetStateAction<Theme>>}>({ theme : "dark", setTheme: () => {} });

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>('dark');
  
  return (
    <Context.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </Context.Provider>
  );
};