export default function Footer() {
    return (
        <footer className="border-t-2 border-lemon-light bg-white dark:bg-neutral-900">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center gap-2">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Made with 🍋 by LemonForm
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    &copy; {new Date().getFullYear()} LemonForm. All rights reserved.
                </p>
            </div>
        </footer>
    );
}