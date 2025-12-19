"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import Loading from "@/components/loading";
import { signOut } from "next-auth/react";
import { BackButton } from "@/components/back";

export default function MyAccount() {
    const { data: session, status } = useSession();

    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [bio, setBio] = useState("");
    const [displayName, setDisplayName] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            setUsername(session.user?.handle ?? "");
            setProfilePic(session.user?.image ?? "");
            setBio(session.user?.bio ?? "");
            setDisplayName(session.user?.displayName ?? "");
        }
    }, [session?.user?.handle, session?.user?.image, session?.user?.bio]);

    if (status === "loading") {
        return <Loading />;
    }

    if (!session) {
        window.location.href = '/login';
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/account/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    handle: username,
                    displayname: displayName,
                    bio,
                    picture: profilePic
                }),
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Account preferences have been updated.");
            } else {
                toast.error(data.error || "An error occured. Please try again later.");
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-background">
            <BackButton />
            <div className="w-full max-w-md mx-auto space-y-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6 text-center">Account Settings</h2>
                <form className="flex flex-col items-center space-y-6 w-full" onSubmit={handleSubmit}>
                    <img
                        src={profilePic || "https://ui-avatars.com/api/?name=User"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 transition-transform duration-200 hover:scale-105 hover:border-blue-500"
                    />
                    <div className="w-full text-left">
                        <label htmlFor="profilePic" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Profile Picture URL</label>
                        <input
                            id="profilePic"
                            type="url"
                            value={profilePic}
                            onChange={e => setProfilePic(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 hover:shadow-md"
                        />
                    </div>
                    <div className="w-full text-left">
                        <label htmlFor="displayName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Display Name</label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 hover:shadow-md"
                        />
                    </div>

                    <div className="w-full text-left">
                        <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Username</label>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full pl-7 pr-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 hover:shadow-md"
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 select-none pointer-events-none">@</span>
                        </div>
                    </div>

                    <div className="w-full text-left">
                        <label htmlFor="bio" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow duration-200 hover:shadow-md"
                        />
                    </div>

                    <div className="w-full text-left">
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={session.user?.email ?? "No email available"}
                            readOnly
                            className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none transition-shadow duration-200 hover:shadow-md"
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full h-11 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="cursor-pointer w-full h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}