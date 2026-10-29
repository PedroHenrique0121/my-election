import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
};

export default function Button({
    variant = "primary",
    className = "",
    type = "button",
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            type={type}
            className={`
                rounded-lg px-4 py-2 font-medium transition
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-primary focus-visible:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                ${variants[variant]}
                ${className}
            `}
            {...props}
        />
    );
}
