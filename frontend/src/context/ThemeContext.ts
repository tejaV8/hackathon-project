import { createContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const themeStorageKey = "ai-company-brain-theme";
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
