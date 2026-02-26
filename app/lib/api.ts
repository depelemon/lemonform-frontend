const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api/v1";

// ── Helpers ─────────────────────────────────────────────────────

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
}

// ── Auth ────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<string> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse<{ ok: boolean; token: string }>(res);
    return data.token;
}

export async function register(email: string, password: string): Promise<string> {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse<{ ok: boolean; token: string }>(res);
    return data.token;
}

// ── Forms ───────────────────────────────────────────────────────

import type { Form, FormResponse, PaginationMeta } from "./types";

export interface ListFormsParams {
    search?: string;
    status?: "open" | "closed";
    sort?: "asc" | "desc";
    sort_by?: "created_at" | "title";
    created_after?: string;
    created_before?: string;
    page?: number;
    limit?: number;
}

export interface ListFormsResult {
    forms: Form[];
    meta: PaginationMeta;
}

export async function listForms(params?: ListFormsParams): Promise<ListFormsResult> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.sort_by) query.set("sort_by", params.sort_by);
    if (params?.created_after) query.set("created_after", params.created_after);
    if (params?.created_before) query.set("created_before", params.created_before);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const res = await fetch(`${API_BASE}/forms${qs ? `?${qs}` : ""}`, {
        headers: authHeaders(),
    });
    const data = await handleResponse<{ ok: boolean; forms: Form[]; meta: PaginationMeta }>(res);
    return { forms: data.forms ?? [], meta: data.meta ?? { page: 1, limit: 12, total: 0 } };
}

export interface FormDetail {
    form: Form;
    owner_email: string;
    response_count: number;
}

export async function getForm(id: number): Promise<FormDetail> {
    const res = await fetch(`${API_BASE}/forms/${id}`, {
        headers: authHeaders(),
    });
    const data = await handleResponse<{ ok: boolean; form: Form; owner_email: string; response_count: number }>(res);
    return { form: data.form, owner_email: data.owner_email, response_count: data.response_count };
}

export async function createForm(title: string, description: string): Promise<Form> {
    const res = await fetch(`${API_BASE}/forms`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title, description }),
    });
    const data = await handleResponse<{ ok: boolean; form: Form }>(res);
    return data.form;
}

export async function updateForm(
    id: number,
    body: { title?: string; description?: string; status?: "open" | "closed" }
): Promise<Form> {
    const res = await fetch(`${API_BASE}/forms/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    const data = await handleResponse<{ ok: boolean; form: Form }>(res);
    return data.form;
}

export async function deleteForm(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/forms/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    await handleResponse(res);
}

// ── Questions ───────────────────────────────────────────────────

import type { Question } from "./types";

export async function createQuestion(
    formId: number,
    body: { label: string; type: string; options?: string; required?: boolean; order?: number }
): Promise<Question> {
    const res = await fetch(`${API_BASE}/forms/${formId}/questions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    const data = await handleResponse<{ ok: boolean; question: Question }>(res);
    return data.question;
}

export async function updateQuestion(
    formId: number,
    questionId: number,
    body: { label?: string; type?: string; options?: string; required?: boolean; order?: number }
): Promise<Question> {
    const res = await fetch(`${API_BASE}/forms/${formId}/questions/${questionId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    const data = await handleResponse<{ ok: boolean; question: Question }>(res);
    return data.question;
}

export async function deleteQuestion(formId: number, questionId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/forms/${formId}/questions/${questionId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    await handleResponse(res);
}

// ── Responses ───────────────────────────────────────────────────

export async function submitResponse(
    formId: number,
    answers: { question_id: number; value: string }[]
): Promise<FormResponse> {
    const res = await fetch(`${API_BASE}/forms/${formId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
    });
    const data = await handleResponse<{ ok: boolean; response: FormResponse }>(res);
    return data.response;
}

export async function listResponses(formId: number): Promise<FormResponse[]> {
    const res = await fetch(`${API_BASE}/forms/${formId}/responses`, {
        headers: authHeaders(),
    });
    const data = await handleResponse<{ ok: boolean; responses: FormResponse[] }>(res);
    return data.responses;
}
