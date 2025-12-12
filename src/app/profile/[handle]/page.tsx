import Link from "next/link"

import { Verified } from "@/components/badges/verified"
import { Moderator } from "@/components/badges/moderator"
import { Button } from "@/components/ui/button"
import { DynamicIsland } from "@/components/dynamic-island"

import { Users } from "@/server/user"

interface ProfilePageParams {
    params: Promise<{ handle: string }>
}

export default async function ProfilePage({ params }: ProfilePageParams) {
    const { handle } = await params
    const user = await Users.getUserByUsername(handle)

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-4">
                <div className="flex flex-col items-center gap-8 text-center max-w-md">
                    <h1 className="text-7xl font-black text-zinc-200 dark:text-white tracking-tight">404</h1>
                    <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mt-0">
                        The user you're looking for doesn't exist.
                    </p>
                    <Button asChild size="lg" className="cursor-pointer mt-2">
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-background">
            <DynamicIsland />
            <div className="max-w-xl mx-auto px-4 py-10">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-28 h-28 rounded-full border-4 border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden -mb-2">
                        <img src={user.image || ''} alt={user.displayName ?? user.handle ?? ''} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 text-center">{user.displayName || user.handle}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 dark:text-zinc-400 text-sm">@{user.handle}</span>
                        {user.verified && <Verified content="Official account of a government, organization, or recognized entity." />}
                        {user.moderator && <Moderator />}
                    </div>
                </div>

                <div className="flex justify-center gap-6 mb-8">
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{user.xp.toLocaleString()}</span>
                        <span className="text-xs text-zinc-400">XP</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{user.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        <span className="text-xs text-zinc-400">Member since</span>
                    </div>
                </div>

                {user.bio && (
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg p-5 mb-8">
                        <h2 className="text-xs font-semibold text-zinc-400 uppercase mb-2 tracking-wider">Bio</h2>
                        <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                            {user.bio
                                .split(/(https?:\/\/[^\s]+)/g)
                                .map((part: string, i: number) =>
                                    /^https?:\/\//.test(part) ? (
                                        <a
                                            key={i}
                                            href={part}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                                        >
                                            {part}
                                        </a>
                                    ) : (
                                        <span key={i}>{part}</span>
                                    )
                                )}
                        </p>
                    </div>
                )}



            </div>
        </div>
    )
}