"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";
import { listForms } from "@/app/lib/api";
import type { Form } from "@/app/lib/types";
import type { PaginationMeta } from "@/app/lib/types";
import Select from "@/app/components/Select";

export default function FormsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [forms, setForms] = useState<Form[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 12, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "open" | "closed">("");
    const [sort, setSort] = useState<"desc" | "asc">("desc");
    const [sortBy, setSortBy] = useState<"created_at" | "title">("created_at");
    const [page, setPage] = useState(1);

    const fetchForms = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const result = await listForms({
                search: search || undefined,
                status: statusFilter || undefined,
                sort,
                sort_by: sortBy,
                page,
                limit: 12,
            });
            setForms(result.forms ?? []);
            setMeta(result.meta ?? { page: 1, limit: 12, total: 0 });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load forms");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, sort, sortBy, page]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        fetchForms();
    }, [isAuthenticated, router, fetchForms]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, sort, sortBy]);

    if (!isAuthenticated) return null;

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Your Forms</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                        Manage and preview your lemon-flavored forms.
                    </p>
                </div>
                <Link
                    href="/forms/new"
                    className="shrink-0 font-semibold px-6 py-2.5 rounded-lg bg-lemon hover:bg-lemon-dark text-neutral-900"
                >
                    Add New Form
                </Link>
            </div>

            {/* Search, filter & sort controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-lemon"
                />
                <Select
                    value={statusFilter}
                    onChange={(v) => setStatusFilter(v as "" | "open" | "closed")}
                    options={[
                        { value: "", label: "All statuses" },
                        { value: "open", label: "Open" },
                        { value: "closed", label: "Closed" },
                    ]}
                />
                <Select
                    value={sortBy}
                    onChange={(v) => setSortBy(v as "created_at" | "title")}
                    options={[
                        { value: "created_at", label: "Sort by Date" },
                        { value: "title", label: "Sort by Title" },
                    ]}
                />
                <Select
                    value={sort}
                    onChange={(v) => setSort(v as "asc" | "desc")}
                    options={[
                        { value: "desc", label: sortBy === "title" ? "Z → A" : "Newest first" },
                        { value: "asc", label: sortBy === "title" ? "A → Z" : "Oldest first" },
                    ]}
                />
            </div>

            {error && <p className="text-red-500 mb-6">{error}</p>}

            {loading ? (
                <p className="text-neutral-500 dark:text-neutral-400">Loading forms...</p>
            ) : forms.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400">
                    No forms found. Create one to get started!
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <Link
                                key={form.id}
                                href={`/forms/${form.id}`}
                                className="block bg-white dark:bg-neutral-800 border-2 border-gray-light dark:border-neutral-700 rounded-2xl p-6 hover:border-lemon hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                        {form.title}
                                    </h2>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            form.status === "open"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        }`}
                                    >
                                        {form.status}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">
                                    {form.description || "No description"}
                                </p>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {new Date(form.created_at).toLocaleDateString()}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-10">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-4 py-2 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-lemon cursor-pointer"
                            >
                                ← Prev
                            </button>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                Page {page} of {totalPages} ({meta.total} forms)
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="px-4 py-2 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-lemon cursor-pointer"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
