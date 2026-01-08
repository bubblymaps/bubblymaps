"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/map/controls/theme-toggle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/footer"

export default function LoginPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.replace("/");
        }
    }, [session, router]);

    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl: "/" });
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const result = await signIn("resend", { 
            email, 
            callbackUrl: "/",
            redirect: false 
        });

        setIsLoading(false);

        if (result?.error) {
            toast.error("Something went wrong. Please try again.");
        } else {
            setEmail("");
            toast.success("Check your email", {
                description: "We sent you a login link. Be sure to check your spam too.",
            });
        }
    };

    return (
        <>
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-background relative">
            <div className="absolute top-4 left-4">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Go back"
                    onClick={() => window.location.href = '/'}
                    className="cursor-pointer rounded-full p-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </Button>
            </div>
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Bubbly Maps
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Find water fountains near you
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={handleGoogleSignIn}
                        variant="outline"
                        className="cursor-pointer w-full h-11 text-sm font-medium border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                        <svg
                            className="mr-2 h-4 w-4"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-background px-2 text-zinc-500 dark:text-zinc-400">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="sr-only">Email</Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            />
                        </div>
                        <Button disabled={isLoading} className="w-full h-11 cursor-pointer">
                            {isLoading ? "Sending..." : "Continue with Email"}
                        </Button>
                    </form>
                </div>
            </div>
            
        </div>
        <Footer/>
        </>
    );
}
