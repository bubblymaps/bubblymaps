"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const currentTheme = theme ?? "light";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative cursor-pointer rounded-full border border-input shadow-md transition",
            "bg-white text-black",
            "dark:bg-zinc-900/80 dark:backdrop-blur-sm dark:text-white",
            "hover:bg-gray-100 dark:hover:bg-zinc-800",
            "h-10 w-10 rounded-full p-0 flex items-center justify-center"
          )}
        >
          {mounted && (
            <>
              <Sun
                className={cn(
                  "h-[1.2rem] w-[1.2rem] transition-all",
                  currentTheme === "light"
                    ? "rotate-0 scale-100"
                    : "rotate-90 scale-0"
                )}
              />
              <Moon
                className={cn(
                  "absolute h-[1.2rem] w-[1.2rem] transition-all",
                  currentTheme === "dark"
                    ? "rotate-0 scale-100"
                    : "rotate-90 scale-0"
                )}
              />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}