"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Light ⇄ dark toggle (Challenge 3). */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      aria-label={
        isDark ? "Switch to light theme" : "Switch to dark theme"
      }
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative size-4">
        <SunIcon
          className={
            "absolute inset-0 size-4 transition-all duration-300 " +
            (isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")
          }
        />
        <MoonIcon
          className={
            "absolute inset-0 size-4 transition-all duration-300 " +
            (isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")
          }
        />
      </span>
    </Button>
  );
}
