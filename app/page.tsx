"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
            {/* Hero */}
            <h1 className="text-5xl sm:text-6xl font-extrabold text-neutral-900 dark:text-white mb-4">
                Build forms in seconds 🍋
            </h1>
            <p className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 max-w-xl mb-10">
                LemonForm makes it easy to create, share, and collect responses —
                no hassle, just fresh forms.
            </p>

            {/* CTA */}
            <div className="flex gap-4">
                {isAuthenticated ? (
                    <Link
                        href="/forms"
                        className="bg-lemon hover:bg-lemon-dark text-neutral-900 font-semibold px-8 py-3 rounded-lg text-lg"
                    >
                        Go to My Forms
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/register"
                            className="bg-lemon hover:bg-lemon-dark text-neutral-900 font-semibold px-8 py-3 rounded-lg text-lg"
                        >
                            Register
                        </Link>
                        <Link
                            href="/login"
                            className="border-2 border-lemon text-neutral-900 dark:text-white hover:bg-lemon-light dark:hover:bg-neutral-700 font-semibold px-8 py-3 rounded-lg text-lg"
                        >
                            Sign In
                        </Link>
                    </>
                )}
            </div>

        </div>
    );
}
