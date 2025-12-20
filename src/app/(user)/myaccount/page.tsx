"use client"

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
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
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
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

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/account/upload", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await res.json();
            if (res.ok && data.url) {
                setProfilePic(data.url);
                toast.success("Image uploaded! Click Save Changes to update your profile.");
            } else {
                toast.error(data.error || "Failed to upload image.");
            }
        } catch (err) {
            toast.error("Failed to upload image. Please try again.");
        }
        setUploading(false);
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-background">
            <BackButton />
            <div className="w-full max-w-md mx-auto space-y-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6 text-center">Account Settings</h2>
                <form className="flex flex-col items-center space-y-6 w-full" onSubmit={handleSubmit}>
                    <div className="relative group">
                        <img
                            src={profilePic || "https://ui-avatars.com/api/?name=User"}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 transition-transform duration-200 hover:scale-105 hover:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            {uploading ? (
                                <svg className="w-6 h-6 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
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