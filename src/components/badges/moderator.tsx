import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import Link from "next/link"

export function Moderator() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge
          variant="destructive"
          className="p-1 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out  hover:from-red-600 hover:to-red-700 border-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1L3 5v6c0 5.25 3.875 10.937 9 12 5.125-1.063 9-6.75 9-12V5l-9-4z" />
          </svg>
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="text-base max-w-[240px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-md">
        <p className="text-sm text-foreground/90 leading-relaxed">
          An official {" "}
          <Link
            href={`/moderators`}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
          >
            Platform Moderator
          </Link>
          .
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
