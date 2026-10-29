import { Option } from "@/types/option-type";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    options: Option[];
    placeholder?: string;
};

export default function Select({
    options,
    placeholder = "Selecione uma opção",
    className = "",
    ...props
}: SelectProps) {
    return (
        <select
            className={`
                w-full rounded-lg border border-slate-300 bg-white px-3 py-2
                text-slate-900 outline-none transition
                focus:border-primary focus:ring-2 focus:ring-primary/20
                disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70
                ${className}
            `}
            {...props}
        >
            <option value="" disabled>
                {placeholder}
            </option>

            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
