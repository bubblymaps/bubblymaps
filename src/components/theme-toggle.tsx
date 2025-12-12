"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  const currentTheme = theme ?? "system";

  const themes = [
    { name: "light", icon: Sun, label: "Light", color: "rgb(251, 191, 36)" },
    { name: "dark", icon: Moon, label: "Dark", color: "rgb(139, 92, 246)" },
    { name: "system", icon: Monitor, label: "System", color: "rgb(59, 130, 246)" },
  ];

  const CurrentIcon = themes.find(t => t.name === currentTheme)?.icon ?? Sun;
  const currentColor = themes.find(t => t.name === currentTheme)?.color ?? "rgb(59, 130, 246)";

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Main Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "relative h-8 w-8 rounded-full flex items-center justify-center",
          "bg-zinc-100/80 dark:bg-zinc-800/80",
          "hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80",
          "transition-colors duration-200",
          "border border-zinc-200/50 dark:border-zinc-700/50"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTheme}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute"
          >
            <CurrentIcon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          </motion.div>
        </AnimatePresence>

        {/* Active indicator ring */}
        <motion.div
          className="absolute -inset-0.5 rounded-full"
          animate={{
            boxShadow: isOpen 
              ? `0 0 0 2px ${currentColor}40`
              : `0 0 0 0px ${currentColor}40`,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 w-40 p-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Arrow */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-zinc-900 border-l border-t border-zinc-200/50 dark:border-zinc-700/50" />

              {/* Theme Options */}
              <div className="relative space-y-1">
                {themes.map((themeOption) => {
                  const isSelected = currentTheme === themeOption.name;
                  const Icon = themeOption.icon;
                  return (
                    <motion.button
                      key={themeOption.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme(themeOption.name);
                        setTimeout(() => setIsOpen(false), 150);
                      }}
                      className={cn(
                        "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200",
                        isSelected
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      )}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <motion.div
                          layoutId="theme-indicator"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${themeOption.color}15, ${themeOption.color}05)`,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      {/* Icon with glow */}
                      <div className="relative">
                        {isSelected && (
                          <motion.div
                            className="absolute -inset-1 rounded-full blur-md"
                            animate={{
                              opacity: [0.3, 0.5, 0.3],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            style={{ backgroundColor: themeOption.color }}
                          />
                        )}
                        <Icon 
                          className={cn(
                            "relative h-4 w-4 transition-colors",
                            isSelected ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"
                          )} 
                        />
                      </div>

                      {/* Label */}
                      <span className={cn(
                        "relative text-sm font-medium transition-colors",
                        isSelected ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"
                      )}>
                        {themeOption.label}
                      </span>

                      {/* Checkmark */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            className="relative ml-auto w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: themeOption.color }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {/* Subtle bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent rounded-b-2xl pointer-events-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
