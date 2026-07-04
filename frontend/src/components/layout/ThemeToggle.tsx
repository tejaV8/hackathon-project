import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-lg border border-white/10 bg-white/[0.06] p-2.5 text-zinc-200 transition hover:border-violet-400/50 hover:bg-white/[0.1] light:border-slate-200 light:bg-white light:text-slate-700"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
