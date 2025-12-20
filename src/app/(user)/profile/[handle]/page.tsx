import Link from "next/link"
import { MapPin, MessageSquare, Edit3, Calendar } from "lucide-react"

import { Verified } from "@/components/badges/verified"
import { Moderator } from "@/components/badges/moderator"
import { Button } from "@/components/ui/button"

import { Users } from "@/server/user/user"
import { BackButton } from "@/components/back"

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

    const contributions = await Users.getUserContributions(user.id)

    // Combine all contributions and sort by date
    const allContributions = [
        ...contributions.bubblers.map(b => ({ type: 'bubbler' as const, data: b, createdAt: b.createdAt })),
        ...contributions.reviews.map(r => ({ type: 'review' as const, data: r, createdAt: r.createdAt })),
        ...contributions.logs.filter(log => log.action !== 'CREATE').map(l => ({ type: 'log' as const, data: l, createdAt: l.createdAt }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const totalContributions = contributions.totalBubblers + contributions.totalReviews + contributions.totalEdits;
    return (
        <div className="min-h-screen bg-white dark:bg-background">
            <BackButton />
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
                        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{totalContributions.toLocaleString()}</span>
                        <span className="text-xs text-zinc-400">Contributions</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{user.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        <span className="text-xs text-zinc-400">Joined</span>
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

                <div className="mb-8">
                    <h2 className="text-xs font-semibold text-zinc-400 uppercase mb-4 tracking-wider">Recent Contributions</h2>

                    <div className="flex flex-col gap-3">
                        {allContributions.map((contribution, index) => {
                            if (contribution.type === 'bubbler') {
                                const bubbler = contribution.data
                                return (
                                    <Link
                                        key={`bubbler-${bubbler.id}`}
                                        href={`/waypoints/${bubbler.id}`}
                                        className="group flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {bubbler.name || 'Unnamed Fountain'}
                                                </span>
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    Added bubbler
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <time className="text-xs text-zinc-400">
                                                {new Date(bubbler.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: new Date(bubbler.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                                })}
                                            </time>
                                        </div>
                                    </Link>
                                )
                            } else if (contribution.type === 'review') {
                                const review = contribution.data
                                return (
                                    <Link
                                        key={`review-${review.id}`}
                                        href={`/waypoints/${review.bubbler.id}`}
                                        className="group flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                <MessageSquare className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {review.bubbler.name || 'Unnamed Fountain'}
                                                </span>
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    Left a review
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <time className="text-xs text-zinc-400">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: new Date(review.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                                })}
                                            </time>
                                        </div>
                                    </Link>
                                )
                            } else {
                                const log = contribution.data
                                return (
                                    <Link
                                        key={`log-${log.id}`}
                                        href={`/waypoints/${log.bubbler.id}`}
                                        className="group flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                <Edit3 className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {log.bubbler.name || 'Unnamed Bubbler'}
                                                </span>
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {log.action === 'UPDATE' ? 'Updated bubbler information' : log.action}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <time className="text-xs text-zinc-400">
                                                {new Date(log.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: new Date(log.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                                })}
                                            </time>
                                        </div>
                                    </Link>
                                )
                            }
                        })}

                        {allContributions.length === 0 && (
                            <div className="p-8 text-center text-zinc-400 dark:text-zinc-500">
                                No contributions yet
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}