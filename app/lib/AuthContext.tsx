"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as api from "./api";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // Load token from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) setToken(stored);
    }, []);

    const saveToken = (t: string) => {
        localStorage.setItem("token", t);
        setToken(t);
    };

    const login = useCallback(async (email: string, password: string) => {
        const t = await api.login(email, password);
        saveToken(t);
        router.push("/forms");
    }, [router]);

    const register = useCallback(async (email: string, password: string) => {
        const t = await api.register(email, password);
        saveToken(t);
        router.push("/forms");
    }, [router]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        router.push("/login");
    }, [router]);

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
