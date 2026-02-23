"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Register:", { email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-8">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-2">
                    Create an account 🍋
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-center mb-8">
                    Start building forms with LemonForm
                </p>

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
                        placeholder="Create a password"
                        value={password}
                        onChange={setPassword}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        required
                    />
                    <Button type="submit" fullWidth>
                        Register
                    </Button>
                </form>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-lemon-dark font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}