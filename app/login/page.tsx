"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useAuth } from "@/app/lib/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-8">
                {/* Header */}
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-2">
                    Welcome back! 🍋
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-center mb-8">
                    Sign in to LemonForm:
                </p>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={setEmail}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={setPassword}
                        required
                    />
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </Button>
                </form>

                {/* Link to register */}
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-lemon-dark font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}