import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-4">
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <div className="flex flex-col gap-4">
          <h1 className="text-9xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">404</h1>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Page Not Found</h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Button asChild size="lg" className="cursor-pointer mt-2">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}