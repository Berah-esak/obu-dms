import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl">
        <Sun className="h-5 w-5 opacity-0" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-10 h-10 rounded-xl glass hover:bg-primary/20 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
      
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-primary rotate-0 scale-100 transition-all duration-500 group-hover:rotate-[360deg] relative z-10" />
      ) : (
        <Sun className="h-5 w-5 text-primary rotate-0 scale-100 transition-all duration-500 group-hover:rotate-[180deg] relative z-10" />
      )}
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
