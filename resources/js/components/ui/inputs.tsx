import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
    className = "",
    type = "text",
    ...props
}: InputProps) {
    return (
        <input
            type={type}
            className={`
                w-full rounded-lg border border-slate-300 bg-white px-3 py-2
                text-slate-900 placeholder:text-slate-400
                outline-none transition
                focus:border-primary focus:ring-2 focus:ring-primary/20
                disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70
                ${className}
            `}
            {...props}
        />
    );
}
