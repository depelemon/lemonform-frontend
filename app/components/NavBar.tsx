import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b-2 border-lemon">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/forms" className="text-xl font-bold text-neutral-900 dark:text-white">
                    🍋 LemonForm
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/forms"
                        className="text-neutral-900 dark:text-white hover:text-lemon-dark font-medium"
                    >
                        Forms
                    </Link>
                    <Link
                        href="/login"
                        className="text-neutral-900 dark:text-white hover:text-lemon-dark font-medium"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="bg-lemon hover:bg-lemon-dark text-neutral-900 font-semibold px-4 py-2 rounded-lg"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}