'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import User from '@/components/user';

export default function Header() {
    const { data: session } = useSession();
    return (
        <header className="relative z-10 p-4 -mt-1 md:p-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 ml-5">
                Bubbly Maps
            </h1>

            <div className="flex items-center gap-4 mr-5">
                {session ? (
                    <User />
                ) : (
                    <Button
                        variant="ghost"
                        asChild
                        className="rounded-full px-4 py-2 hover:bg-accent hover:text-accent-foreground focus:ring-4 focus:ring-accent/50"
                    >
                        <Link href="/login">Sign In</Link>
                    </Button>
                )}
                <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 rounded-full"
                >
                    <Link href="/map" className="py-2 text-white font-semibold rounded-full">
                        Open Map
                    </Link>
                </Button>
            </div>
        </header>
    )
}