"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, MapPin, Search, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion"

export function DynamicIsland() {
  const router = useRouter()
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [activeGlow, setActiveGlow] = useState({ x: 0, y: 0 })
  const islandRef = useRef<HTMLDivElement>(null)

  // Smoother spring physics - Apple-like feel
  const mouseX = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 })
  const mouseY = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 })
  const scale = useSpring(1, { stiffness: 300, damping: 25, mass: 0.8 })
  const glowIntensity = useSpring(0, { stiffness: 200, damping: 30 })

  // Reactive glow position tracking
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  // Transform for subtle 3D tilt effect
  const rotateX = useTransform(mouseY, [-5, 5], [3, -3])
  const rotateY = useTransform(mouseX, [-5, 5], [-3, 3])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (islandRef.current && isHovered) {
        const rect = islandRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Smoother parallax movement
        const deltaX = (e.clientX - centerX) / 40
        const deltaY = (e.clientY - centerY) / 40

        mouseX.set(deltaX)
        mouseY.set(deltaY)

        // Calculate glow position as percentage
        const relativeX = ((e.clientX - rect.left) / rect.width) * 100
        const relativeY = ((e.clientY - rect.top) / rect.height) * 100
        glowX.set(Math.max(0, Math.min(100, relativeX)))
        glowY.set(Math.max(0, Math.min(100, relativeY)))
        setActiveGlow({ x: relativeX, y: relativeY })
      }
    },
    [isHovered, mouseX, mouseY, glowX, glowY],
  )

  useEffect(() => {
    if (isHovered) {
      window.addEventListener("mousemove", handleMouseMove)
      glowIntensity.set(1)
    } else {
      mouseX.set(0)
      mouseY.set(0)
      glowIntensity.set(0)
      glowX.set(50)
      glowY.set(50)
    }

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isHovered, handleMouseMove, mouseX, mouseY, glowIntensity, glowX, glowY])

  useEffect(() => {
    scale.set(isHovered ? 1.02 : 1)
  }, [isHovered, scale])

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname?.startsWith(path)
  }

  return (
    <div className="fixed top-6 left-1/2 z-50 pointer-events-none -translate-x-1/2">
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          scale,
          rotateX,
          rotateY,
          perspective: 1000,
        }}
        className="relative"
      >
        {/* Apple-style ambient glow - soft gradients */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary glow - soft blue/purple */}
          <motion.div
            className="absolute -inset-[2px] rounded-full blur-lg"
            animate={{
              opacity: isHovered ? 0.6 : 0.25,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              background: `linear-gradient(135deg, 
                rgb(88, 166, 255) 0%, 
                rgb(147, 112, 219) 50%, 
                rgb(236, 72, 153) 100%)`,
            }}
          />

          {/* Secondary glow - reactive to mouse */}
          <motion.div
            className="absolute -inset-[8px] rounded-full blur-xl"
            animate={{
              opacity: isHovered ? 0.4 : 0.15,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              background: `radial-gradient(circle at ${activeGlow.x}% ${activeGlow.y}%, 
                rgb(59, 130, 246) 0%,
                rgb(139, 92, 246) 40%,
                transparent 70%)`,
            }}
          />

          {/* Soft outer ambient glow */}
          <motion.div
            className="absolute -inset-[16px] rounded-full blur-2xl"
            animate={{
              opacity: isHovered ? 0.35 : 0.12,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: `conic-gradient(from 180deg, 
                rgb(59, 130, 246),
                rgb(147, 51, 234),
                rgb(236, 72, 153),
                rgb(251, 146, 60),
                rgb(59, 130, 246))`,
            }}
          />

          {/* Interactive highlight spot */}
          <motion.div
            className="absolute -inset-[4px] rounded-full blur-md"
            animate={{
              opacity: isHovered ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at ${activeGlow.x}% ${activeGlow.y}%, 
                rgba(255, 255, 255, 0.8) 0%,
                rgba(147, 197, 253, 0.4) 30%,
                transparent 60%)`,
            }}
          />
        </div>

        <motion.div
          ref={islandRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setHoveredButton(null)
          }}
          animate={{
            paddingLeft: isHovered ? 20 : 14,
            paddingRight: isHovered ? 20 : 14,
            paddingTop: isHovered ? 12 : 10,
            paddingBottom: isHovered ? 12 : 10,
            gap: isHovered ? 10 : 6,
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
            mass: 0.8,
          }}
          className={cn(
            "relative flex items-center rounded-full pointer-events-auto overflow-hidden",
            "bg-white/95 dark:bg-black/90",
            "border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
          )}
          style={{
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
          }}
        >
          {/* Inner reactive glow */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              opacity: isHovered ? 0.08 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at ${activeGlow.x}% ${activeGlow.y}%, 
                rgb(59, 130, 246) 0%,
                rgb(147, 51, 234) 50%,
                transparent 80%)`,
            }}
          />

          {/* Subtle inner border glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-30"
            style={{
              background: `linear-gradient(135deg, 
                rgba(255,255,255,0.2) 0%, 
                transparent 50%, 
                rgba(255,255,255,0.05) 100%)`,
            }}
          />

          {/* Navigation Buttons */}
          <NavButton
            icon={Home}
            onClick={() => router.push("/home")}
            isActive={isActive("/home")}
            isExpanded={isHovered}
            isHovered={hoveredButton === "home"}
            onHover={() => setHoveredButton("home")}
            onLeave={() => setHoveredButton(null)}
            label="Home"
            accentColor="rgb(59, 130, 246)"
          />

          <NavButton
            icon={MapPin}
            onClick={() => router.push("/")}
            isActive={isActive("/")}
            isExpanded={isHovered}
            isHovered={hoveredButton === "map"}
            onHover={() => setHoveredButton("map")}
            onLeave={() => setHoveredButton(null)}
            label="Map"
            accentColor="rgb(147, 51, 234)"
          />

          <NavButton
            icon={Search}
            onClick={() => router.push("/search")}
            isActive={isActive("/search")}
            isExpanded={isHovered}
            isHovered={hoveredButton === "search"}
            onHover={() => setHoveredButton("search")}
            onLeave={() => setHoveredButton(null)}
            label="Search"
            accentColor="rgb(236, 72, 153)"
          />

          <motion.div
            className="w-px bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-600 to-transparent mx-1"
            animate={{
              height: isHovered ? 28 : 20,
              opacity: isHovered ? 0.6 : 0.3,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
          />

          {/* User Button */}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative"
          >
            {hoveredButton === "user" && (
              <motion.div
                className="absolute -inset-2 rounded-full blur-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  background: `radial-gradient(circle, rgb(34, 197, 94), transparent 70%)`,
                }}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/myaccount")}
              onMouseEnter={() => setHoveredButton("user")}
              onMouseLeave={() => setHoveredButton(null)}
              className={cn(
                "relative h-8 w-8 rounded-full transition-colors duration-200",
                "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400",
              )}
            >
              <UserIcon className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Refined Tooltip */}
        <AnimatePresence>
          {hoveredButton && ["home", "map", "search", "user"].includes(hoveredButton) && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.5,
              }}
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <div className="relative px-3 py-1.5 rounded-lg bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-900 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-sm">
                {hoveredButton === "user"
                  ? "My Account"
                  : hoveredButton.charAt(0).toUpperCase() + hoveredButton.slice(1)}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-zinc-900/95 dark:bg-zinc-100/95" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

interface NavButtonProps {
  icon: React.ElementType
  onClick: () => void
  isActive: boolean
  isExpanded: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  label: string
  accentColor: string
}

function NavButton({
  icon: Icon,
  onClick,
  isActive,
  isExpanded,
  isHovered,
  onHover,
  onLeave,
  accentColor,
}: NavButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative"
    >
      {/* Active state glow */}
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              className="absolute -inset-2 rounded-full blur-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                background: `radial-gradient(circle, ${accentColor}, transparent 70%)`,
              }}
            />
            <motion.div
              className="absolute -inset-1 rounded-full blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              style={{
                background: accentColor,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Hover glow */}
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            className="absolute -inset-2 rounded-full blur-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              background: `radial-gradient(circle, ${accentColor}, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className={cn(
          "relative h-8 w-8 rounded-full transition-all duration-200",
          isActive
            ? "bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg"
            : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400",
        )}
      >
        <motion.div
          animate={{
            rotate: isHovered ? [0, -6, 6, 0] : 0,
            scale: isExpanded ? 1.05 : 1,
          }}
          transition={{
            rotate: { duration: 0.4, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 350, damping: 25 },
          }}
        >
          <Icon className="h-4 w-4 relative z-10" />
        </motion.div>
      </Button>
    </motion.div>
  )
}
