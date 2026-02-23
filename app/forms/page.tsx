import Link from "next/link";
import { dummyForms } from "@/app/lib/dummyData";

export default function FormsPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Your Forms</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">Manage and preview your lemon-flavored forms.</p>
            </div>

            {/* Form cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyForms.map((form) => (
                    <Link
                        key={form.id}
                        href={`/forms/${form.id}`}
                        className="block bg-white dark:bg-neutral-800 border-2 border-gray-light dark:border-neutral-700 rounded-2xl p-6 hover:border-lemon hover:shadow-md"
                    >
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                            {form.title}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">
                            {form.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                            <span>{form.questions.length} questions</span>
                            <span>{form.createdAt}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
