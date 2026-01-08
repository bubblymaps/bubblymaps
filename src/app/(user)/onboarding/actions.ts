"use client";

export async function completeOnboarding(
    name: string,
    username: string,
) {
    try {
        const res = await fetch("/api/account", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                handle: username,
                displayname: name
            }),
            credentials: "include"
        });

        if (res.ok) {
            const data = await res.json();
            return { success: true, user: data.user };
        }

        const errorData = await res.json();
        return { error: errorData.error || "Failed to complete onboarding" };
    } catch (err: any) {
        return { error: err.message };
    }
}