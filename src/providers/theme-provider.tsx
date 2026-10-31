"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Light/dark theming (Challenge 3) with no flash of wrong theme on load. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
