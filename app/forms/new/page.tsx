"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";
import { createForm, createQuestion } from "@/app/lib/api";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

type QuestionType = "short_answer" | "radio" | "checkbox" | "dropdown";

interface DraftQuestion {
    key: number; // client-side key
    label: string;
    type: QuestionType;
    required: boolean;
    options: string[]; // only for radio / checkbox / dropdown
}

let nextKey = 0;

function newDraftQuestion(): DraftQuestion {
    return { key: nextKey++, label: "", type: "short_answer", required: true, options: [] };
}

export default function NewFormPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"open" | "closed">("open");
    const [questions, setQuestions] = useState<DraftQuestion[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    // ── Question helpers ────────────────────────────────────────

    const addQuestion = () => {
        setQuestions((prev) => [...prev, newDraftQuestion()]);
    };

    const removeQuestion = (key: number) => {
        setQuestions((prev) => prev.filter((q) => q.key !== key));
    };

    const updateQuestion = (key: number, patch: Partial<DraftQuestion>) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.key !== key) return q;
                const updated = { ...q, ...patch };
                // When switching to short_answer, clear options
                if (patch.type === "short_answer") updated.options = [];
                // When switching FROM short_answer to an option type, seed one empty option
                if (patch.type && patch.type !== "short_answer" && q.type === "short_answer") {
                    updated.options = [""];
                }
                return updated;
            })
        );
    };

    const addOption = (key: number) => {
        setQuestions((prev) =>
            prev.map((q) => (q.key === key ? { ...q, options: [...q.options, ""] } : q))
        );
    };

    const updateOption = (key: number, optionIdx: number, value: string) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.key !== key) return q;
                const opts = [...q.options];
                opts[optionIdx] = value;
                return { ...q, options: opts };
            })
        );
    };

    const removeOption = (key: number, optionIdx: number) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.key !== key) return q;
                return { ...q, options: q.options.filter((_, i) => i !== optionIdx) };
            })
        );
    };

    // ── Submit ──────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Create the form
            const form = await createForm(title.trim(), description.trim());

            // 2. If status is closed, update it (createForm defaults to open)
            if (status === "closed") {
                const { updateForm } = await import("@/app/lib/api");
                await updateForm(form.id, { status: "closed" });
            }

            // 3. Create each question sequentially (order matters)
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.label.trim()) continue; // skip empty labels

                const needsOptions = q.type !== "short_answer";
                const filteredOptions = q.options.filter((o) => o.trim() !== "");

                await createQuestion(form.id, {
                    label: q.label.trim(),
                    type: q.type,
                    options: needsOptions ? JSON.stringify(filteredOptions) : undefined,
                    required: q.required,
                    order: i + 1,
                });
            }

            router.push(`/forms/${form.id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create form");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <Link href="/forms" className="text-sm text-lemon-dark hover:underline mb-6 inline-block">
                &larr; Back to Forms
            </Link>

            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Create a new form</h1>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Title, Description & Status */}
                <div className="bg-white dark:bg-neutral-800 border-2 border-gray-light dark:border-neutral-700 rounded-2xl p-6 flex flex-col gap-5">
                    <Input label="Title" placeholder="My awesome form" value={title} onChange={setTitle} required />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Description</label>
                        <textarea
                            placeholder="Tell people what this form is about..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-lemon resize-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                            Accepting responses
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={status === "open"}
                                onClick={() => setStatus(status === "open" ? "closed" : "open")}
                                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-lemon ${
                                    status === "open" ? "bg-lemon" : "bg-neutral-300 dark:bg-neutral-600"
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        status === "open" ? "translate-x-5" : "translate-x-0"
                                    }`}
                                    style={{ width: "1.375rem", height: "1.375rem" }}
                                />
                            </button>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                status === "open"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}>
                                {status === "open" ? "open" : "closed"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Questions</h2>

                    {questions.length === 0 && (
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">
                            No questions yet. Click the button below to add one.
                        </p>
                    )}

                    <div className="flex flex-col gap-4">
                        {questions.map((q, idx) => (
                            <QuestionEditor
                                key={q.key}
                                index={idx}
                                question={q}
                                onUpdate={(patch) => updateQuestion(q.key, patch)}
                                onRemove={() => removeQuestion(q.key)}
                                onAddOption={() => addOption(q.key)}
                                onUpdateOption={(oi, val) => updateOption(q.key, oi, val)}
                                onRemoveOption={(oi) => removeOption(q.key, oi)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-lemon hover:text-lemon-dark font-medium text-sm cursor-pointer"
                    >
                        + Add Question
                    </button>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => router.push("/forms")}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Creating..." : "Create Form"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// ── QuestionEditor component ────────────────────────────────────

interface QuestionEditorProps {
    index: number;
    question: DraftQuestion;
    onUpdate: (patch: Partial<DraftQuestion>) => void;
    onRemove: () => void;
    onAddOption: () => void;
    onUpdateOption: (optionIdx: number, value: string) => void;
    onRemoveOption: (optionIdx: number) => void;
}

function QuestionEditor({
    index,
    question,
    onUpdate,
    onRemove,
    onAddOption,
    onUpdateOption,
    onRemoveOption,
}: QuestionEditorProps) {
    const hasOptions = question.type !== "short_answer";

    return (
        <div className="bg-white dark:bg-neutral-800 border-2 border-gray-light dark:border-neutral-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                    Question {index + 1}
                </p>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer"
                >
                    Remove
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {/* Label */}
                <input
                    type="text"
                    placeholder="Question label"
                    value={question.label}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-lemon"
                />

                {/* Type selector & Required toggle row */}
                <div className="flex gap-4 items-center">
                    <select
                        value={question.type}
                        onChange={(e) => onUpdate({ type: e.target.value as QuestionType })}
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-lemon"
                    >
                        <option value="short_answer">Short Answer</option>
                        <option value="radio">Radio (single choice)</option>
                        <option value="checkbox">Checkbox (multi choice)</option>
                        <option value="dropdown">Dropdown</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer shrink-0">
                        <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => onUpdate({ required: e.target.checked })}
                            className="w-4 h-4 accent-lemon"
                        />
                        Required
                    </label>
                </div>

                {/* Options list (for radio, checkbox, dropdown) */}
                {hasOptions && (
                    <div className="flex flex-col gap-2 ml-2">
                        {question.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                                <span className="text-neutral-400 text-sm">{oi + 1}.</span>
                                <input
                                    type="text"
                                    placeholder={`Option ${oi + 1}`}
                                    value={opt}
                                    onChange={(e) => onUpdateOption(oi, e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:border-lemon"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveOption(oi)}
                                    className="text-xs text-red-400 hover:text-red-500 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={onAddOption}
                            className="text-sm text-lemon-dark hover:underline self-start mt-1 cursor-pointer"
                        >
                            + Add option
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
