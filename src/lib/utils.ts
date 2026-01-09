import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (!["http:", "https:"].includes(parsed.protocol)) return false
    if (!/\.(jpe?g|png|gif|webp)$/i.test(parsed.pathname)) return false
    return true
  } catch {
    return false
  }
}