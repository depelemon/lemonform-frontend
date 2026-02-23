"use client";

interface InputProps {
    label: string;                              
    type?: "text" | "email" | "password";       
    placeholder?: string;                      
    value: string;                             
    onChange: (value: string) => void;          
    required?: boolean;
}

export default function Input({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    required = false,
}: InputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-light dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-lemon"
            />
        </div>
    );
}