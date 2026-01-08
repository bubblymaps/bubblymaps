"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeOnboarding } from "./actions";
import { toast } from 'sonner'

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleContinue = () => setStep(1);

    const handleNameNext = () => {
        if (!name.trim()) {
            setError("Enter your name");
            return;
        }
        setError("");
        setStep(2);
    };

    const handleUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("Enter a valid username");
            return;
        }

        if (username.length < 5) {
            setError("Username must be 5+ characters");
            return;
        }

        setLoading(true);
        toast.loading("Completing onboarding...", { id: 'onboarding' });

        try {
            const result = await completeOnboarding(name, username);

            if (result && result.error) {
                setError(result.error);
                toast.error(result.error, { id: 'onboarding' });
                setLoading(false);
                return;
            }

            toast.success("Onboarding complete! Redirecting...", { id: 'onboarding' });

            await new Promise(resolve => setTimeout(resolve, 1700));
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {step === 0 && (
                <div className="text-center">
                    <h1 className="text-2xl font-light mb-8">Welcome to Bubbly Maps</h1>
                    <Button onClick={handleContinue} variant="outline" className="w-32">
                        Continue
                    </Button>
                </div>
            )}

            {step === 1 && (
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-light mb-6">What's your name?</h1>
                    <Input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                        }}
                        onKeyPress={(e) => e.key === "Enter" && handleNameNext()}
                        autoFocus
                        className="mb-4"
                    />
                    {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
                    <Button onClick={handleNameNext} variant="outline" className="w-full">
                        Next
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="w-full max-w-sm">
                    <form onSubmit={handleUsernameSubmit}>
                        <h1 className="text-2xl font-light mb-6">Choose a username</h1>
                        <Input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value.toLowerCase());
                                setError("");
                            }}
                            autoFocus
                            className="mb-4"
                        />
                        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
                        <Button type="submit" disabled={loading} variant="outline" className="w-full">
                            {loading ? "Completing..." : "Complete"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}