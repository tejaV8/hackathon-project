import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-violet-600 text-white shadow-lg shadow-violet-700/30 hover:bg-violet-500",
  secondary:
    "border border-white/10 bg-white/[0.06] text-white hover:border-violet-400/50 hover:bg-white/[0.1] light:text-slate-900",
  ghost: "text-zinc-300 hover:bg-white/[0.08] hover:text-white light:text-slate-600 light:hover:text-slate-950",
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
