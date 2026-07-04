import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  action,
}: PageHeaderProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111118] p-6 shadow-xl shadow-black/10 light:border-slate-200 light:bg-white">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          {Icon && (
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-950/30 sm:flex">
              <Icon size={24} />
            </div>
          )}
          <div>
            {eyebrow && (
              <p className="mb-2 text-sm font-medium text-violet-300 light:text-violet-700">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-semibold tracking-tight text-white light:text-slate-950">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 light:text-slate-600">
              {subtitle}
            </p>
          </div>
        </div>
        {action}
      </div>
    </section>
  );
}
