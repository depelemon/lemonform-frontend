"use client";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
    disabled?: boolean;
}

export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    fullWidth = false,
    disabled = false,
}: ButtonProps) {
    const base = "font-semibold px-6 py-2.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-lemon hover:bg-lemon-dark text-neutral-900",
        secondary:
            "bg-transparent border-2 border-lemon text-neutral-900 dark:text-white hover:bg-lemon-light dark:hover:bg-neutral-700",
        danger: "bg-red-500 hover:bg-red-600 text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
        >
            {children}
        </button>
    );
}