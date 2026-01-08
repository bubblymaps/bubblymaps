'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import User from '@/components/user';

export default function Header() {
    const { data: session } = useSession();
    return (
        <header className="relative z-10 p-4 md:p-6 flex items-center justify-end">
            <div className="flex items-center gap-4">
                {session ? (
                    <User />

                ) : (
                    <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                )}
                <Button asChild>
                    <Link href="/map">Open Map</Link>
                </Button>
            </div>
        </header>
    )
}