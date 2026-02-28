"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getFormPublic, submitResponse } from "@/app/lib/api";
import type { Form, Question } from "@/app/lib/types";
import { parseOptions } from "@/app/lib/types";
import Button from "@/app/components/Button";
import Select from "@/app/components/Select";

export default function RespondPage() {
    const { id } = useParams<{ id: string }>();

    const [form, setForm] = useState<Form | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // answers keyed by question ID
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            setLoading(true);
            try {
                const data = await getFormPublic(Number(id));
                setForm(data);
                // Initialize all answers to ""
                const initial: Record<number, string> = {};
                for (const q of data.questions ?? []) {
                    initial[q.id] = q.type === "checkbox" ? "[]" : "";
                }
                setAnswers(initial);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load form");
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    const updateAnswer = (questionId: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const toggleCheckbox = (questionId: number, option: string) => {
        setAnswers((prev) => {
            const current: string[] = (() => {
                try { return JSON.parse(prev[questionId] || "[]"); } catch { return []; }
            })();
            const next = current.includes(option)
                ? current.filter((o) => o !== option)
                : [...current, option];
            return { ...prev, [questionId]: JSON.stringify(next) };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form) return;

        const questions = form.questions ?? [];

        // Validate required questions answered
        for (const q of questions) {
            if (!q.required) continue; // skip optional questions
            const val = answers[q.id] ?? "";
            if (q.type === "checkbox") {
                const arr: string[] = (() => { try { return JSON.parse(val); } catch { return []; } })();
                if (arr.length === 0) {
                    setError(`Please answer: "${q.label}"`);
                    return;
                }
            } else if (!val.trim()) {
                setError(`Please answer: "${q.label}"`);
                return;
            }
        }

        setSubmitting(true);
        try {
            await submitResponse(
                form.id,
                questions
                    .filter((q) => {
                        const val = answers[q.id] ?? "";
                        if (q.type === "checkbox") {
                            try { return JSON.parse(val).length > 0; } catch { return false; }
                        }
                        return val.trim() !== "";
                    })
                    .map((q) => ({
                        question_id: q.id,
                        value: answers[q.id] ?? "",
                    }))
            );
            setSubmitted(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to submit response");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Loading / error states ──────────────────────────────────

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
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!form) return null;

    // ── Form is closed ──────────────────────────────────────────

    if (form.status === "closed") {
        return (
            <div className="max-w-3xl mx-auto px-6 py-10 text-center">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{form.title}</h1>
                <p className="text-red-500 font-medium mt-4">This form is closed and no longer accepts responses.</p>
            </div>
        );
    }

    // ── Success state ───────────────────────────────────────────

    if (submitted) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-10 text-center">
                <div className="text-5xl mb-4">🍋</div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Response submitted!</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Thank you for filling out <span className="font-medium">{form.title}</span>.
                </p>
            </div>
        );
    }

    // ── Response form ───────────────────────────────────────────

    const questions = form.questions ?? [];

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{form.title}</h1>
                {form.description && (
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">{form.description}</p>
                )}
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                </p>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {questions.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400">This form has no questions yet.</p>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {questions.map((question, index) => (
                        <QuestionField
                            key={question.id}
                            question={question}
                            index={index}
                            value={answers[question.id] ?? ""}
                            onChange={(val) => updateAnswer(question.id, val)}
                            onToggleCheckbox={(opt) => toggleCheckbox(question.id, opt)}
                        />
                    ))}

                    <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Response"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

// ── QuestionField component ─────────────────────────────────────

interface QuestionFieldProps {
    question: Question;
    index: number;
    value: string;
    onChange: (value: string) => void;
    onToggleCheckbox: (option: string) => void;
}

function QuestionField({ question, index, value, onChange, onToggleCheckbox }: QuestionFieldProps) {
    const options = parseOptions(question.options);
    const checkedValues: string[] = (() => {
        try { return JSON.parse(value || "[]"); } catch { return []; }
    })();

    return (
        <div className="bg-white dark:bg-neutral-800 border-2 border-gray-light dark:border-neutral-700 rounded-2xl p-6">
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                Question {index + 1}
            </p>
            <p className="text-neutral-900 dark:text-white font-medium mb-4">
                {question.label}{" "}
                {question.required ? (
                    <span className="text-red-500">*</span>
                ) : (
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">(optional)</span>
                )}
            </p>

            {question.type === "short_answer" && (
                <input
                    type="text"
                    placeholder="Your answer"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-lemon"
                />
            )}

            {question.type === "radio" && options.length > 0 && (
                <div className="flex flex-col gap-2">
                    {options.map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200 cursor-pointer"
                        >
                            <input
                                type="radio"
                                name={`q-${question.id}`}
                                value={option}
                                checked={value === option}
                                onChange={() => onChange(option)}
                                className="w-4 h-4 accent-lemon"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {question.type === "checkbox" && options.length > 0 && (
                <div className="flex flex-col gap-2">
                    {options.map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={checkedValues.includes(option)}
                                onChange={() => onToggleCheckbox(option)}
                                className="w-4 h-4 accent-lemon"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {question.type === "dropdown" && options.length > 0 && (
                <Select
                    value={value}
                    onChange={(v) => onChange(v)}
                    options={[
                        { value: "", label: "Select an option..." },
                        ...options.map((option) => ({ value: option, label: option })),
                    ]}
                    className="w-full"
                />
            )}
        </div>
    );
}
