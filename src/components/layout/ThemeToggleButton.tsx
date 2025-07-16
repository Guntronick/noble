
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggleButton() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // When mounted on client, now we can show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch and layout shifts.
    return <Button variant="ghost" size="icon" disabled className="text-panel-foreground" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" || theme === 'system' ? "dark" : "light")}
      className="hover:bg-panel-foreground/10 text-panel-foreground group"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0 transition-transform duration-500 rotate-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100 transition-transform duration-500 rotate-90 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
