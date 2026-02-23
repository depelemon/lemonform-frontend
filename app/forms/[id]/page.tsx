import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyForms } from "@/app/lib/dummyData";
import type { Question } from "@/app/lib/dummyData";

interface FormDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function FormDetailPage({ params }: FormDetailPageProps) {
    const { id } = await params;
    const form = dummyForms.find((f) => f.id === Number(id));

    if (!form) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            {/* Back link */}
            <Link
                href="/forms"
                className="text-sm text-lemon-dark hover:underline mb-6 inline-block"
            >
                &larr; Back to Forms
            </Link>

            {/* Form header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{form.title}</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">{form.description}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Created: {form.createdAt} &middot; {form.questions.length} questions
                </p>
            </div>

            {/* Questions list (read-only) */}
            <div className="flex flex-col gap-6">
                {form.questions.map((question, index) => (
                    <QuestionPreview key={question.id} question={question} index={index} />
                ))}
            </div>
        </div>
    );
}

function QuestionPreview({ question, index }: { question: Question; index: number }) {
    return (
        <div className="bg-white dark:bg-neutral-800 border-2 border-gray-light dark:border-neutral-700 rounded-2xl p-6">
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Question {index + 1}</p>
            <p className="text-neutral-900 dark:text-white font-medium mb-4">{question.label}</p>

            {/* Render read-only preview based on question type */}
            {question.type === "text" && (
                <div className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-gray-light dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-sm">
                    Short answer text
                </div>
            )}

            {question.type === "radio" && question.options && (
                <div className="flex flex-col gap-2">
                    {question.options.map((option) => (
                        <label key={option} className="flex items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200">
                            <span className="w-4 h-4 rounded-full border-2 border-neutral-400 dark:border-neutral-500 inline-block" />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {question.type === "checkbox" && question.options && (
                <div className="flex flex-col gap-2">
                    {question.options.map((option) => (
                        <label key={option} className="flex items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200">
                            <span className="w-4 h-4 rounded border-2 border-neutral-400 dark:border-neutral-500 inline-block" />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {question.type === "dropdown" && question.options && (
                <div className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-gray-light dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-sm">
                    {question.options[0]} ▾
                </div>
            )}
        </div>
    );
}
