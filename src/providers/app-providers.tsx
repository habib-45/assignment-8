"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";

function AppToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast:
            "font-sans rounded-xl !ring-1 !ring-border shadow-lg backdrop-blur",
        },
      }}
    />
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <AppToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
