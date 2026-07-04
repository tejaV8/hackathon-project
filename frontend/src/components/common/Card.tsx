import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export default function Card({
  children,
  className,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl",
        "light:border-slate-200 light:bg-white light:shadow-slate-200/60",
        interactive &&
          "transition duration-200 hover:-translate-y-1 hover:border-violet-400/60 hover:bg-white/[0.08] hover:shadow-violet-950/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
