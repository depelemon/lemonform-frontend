"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";
import { getForm, deleteForm } from "@/app/lib/api";
import type { Form, Question } from "@/app/lib/types";
import { parseOptions } from "@/app/lib/types";
import Button from "@/app/components/Button";

export default function FormDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState<Form | null>(null);
    const [ownerEmail, setOwnerEmail] = useState("");
    const [responseCount, setResponseCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleting, setDeleting] = useState(false);

    const fetchForm = async () => {
        setLoading(true);
        try {
            const data = await getForm(Number(id));
            setForm(data.form);
            setOwnerEmail(data.owner_email);
            setResponseCount(data.response_count);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load form");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        fetchForm();
    }, [id, isAuthenticated, router]);

    // ── Handlers ────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!form) return;
        if (!confirm("Are you sure you want to delete this form? This cannot be undone.")) return;
        setDeleting(true);
        try {
            await deleteForm(form.id);
            router.push("/forms");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete form");
            setDeleting(false);
        }
    };

    // ── Loading / error states ──────────────────────────────────

    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-10">
                <p className="text-neutral-500 dark:text-neutral-400">Loading form...</p>
            </div>
        );
    }

    if (error && !form) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-10">
                <p className="text-red-500">{error || "Form not found"}</p>
                <Link href="/forms" className="text-sm text-lemon-dark hover:underline mt-4 inline-block">
                    &larr; Back to Forms
                </Link>
            </div>
        );
    }

    if (!form) return null;

    const questions = form.questions ?? [];

    // ── Render ──────────────────────────────────────────────────

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <Link href="/forms" className="text-sm text-lemon-dark hover:underline mb-6 inline-block">
                &larr; Back to Forms
            </Link>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Form header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{form.title}</h1>
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
                    <Link href={`/forms/${form.id}/edit`}>
                        <Button variant="secondary">Edit Form</Button>
                    </Link>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">{form.description}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Created by <span className="font-medium">{ownerEmail}</span> &middot; {new Date(form.created_at).toLocaleDateString()} &middot; {questions.length} question{questions.length !== 1 ? "s" : ""} &middot; {responseCount} response{responseCount !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-3 mt-4">
                    <Link
                        href={`/forms/${form.id}/respond`}
                        className="flex-1 text-center font-semibold px-5 py-2.5 rounded-lg bg-lemon hover:bg-lemon-dark text-neutral-900 text-sm"
                    >
                        Fill Out Form
                    </Link>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/forms/${form.id}/respond`);
                            alert("Response link copied to clipboard!");
                        }}
                        className="shrink-0 p-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 hover:border-lemon text-neutral-500 dark:text-neutral-400 hover:text-lemon-dark cursor-pointer"
                        title="Copy share link"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                    </button>
                </div>
            </div>

            {/* Questions */}
            {questions.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400">No questions yet.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {questions.map((question, index) => (
                        <QuestionPreview key={question.id} question={question} index={index} />
                    ))}
                </div>
            )}

            {/* Delete at bottom-right */}
            <div className="flex justify-end mt-10">
                <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete Form"}
                </Button>
            </div>
        </div>
    );
}

function QuestionPreview({ question, index }: { question: Question; index: number }) {
    const options = parseOptions(question.options);

    return (
        <div className="bg-white dark:bg-neutral-800 border-2 border-gray-light dark:border-neutral-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Question {index + 1}</p>
                {!question.required && (
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 italic">Optional</span>
                )}
            </div>
            <p className="text-neutral-900 dark:text-white font-medium mb-4">
                {question.label}
                {question.required && <span className="text-red-500 ml-0.5">*</span>}
            </p>

            {question.type === "short_answer" && (
                <div className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-gray-light dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-sm">
                    Short answer text
                </div>
            )}

            {question.type === "radio" && options.length > 0 && (
                <div className="flex flex-col gap-2">
                    {options.map((option) => (
                        <label key={option} className="flex items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200">
                            <span className="w-4 h-4 rounded-full border-2 border-neutral-400 dark:border-neutral-500 inline-block" />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {question.type === "checkbox" && options.length > 0 && (
                <div className="flex flex-col gap-2">
                    {options.map((option) => (
                        <label key={option} className="flex items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200">
                            <span className="w-4 h-4 rounded border-2 border-neutral-400 dark:border-neutral-500 inline-block" />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {question.type === "dropdown" && options.length > 0 && (
                <div className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-gray-light dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-sm">
                    {options[0]} ▾
                </div>
            )}
        </div>
    );
}
