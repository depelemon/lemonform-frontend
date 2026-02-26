// ── Backend-aligned type definitions ────────────────────────────

export interface Question {
    id: number;
    form_id: number;
    label: string;
    type: "short_answer" | "radio" | "checkbox" | "dropdown";
    options: string; // JSON-encoded string, e.g. '["A","B","C"]'
    required: boolean;
    order: number;
}

export interface Form {
    id: number;
    title: string;
    description: string;
    status: "open" | "closed";
    owner_id: number;
    questions?: Question[];
    created_at: string;
    updated_at: string;
}

export interface Answer {
    id: number;
    response_id: number;
    question_id: number;
    value: string;
}

export interface FormResponse {
    id: number;
    form_id: number;
    answers?: Answer[];
    created_at: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}

// ── Helper to parse the JSON options string ─────────────────────

export function parseOptions(options: string): string[] {
    if (!options) return [];
    try {
        return JSON.parse(options);
    } catch {
        return [];
    }
}
