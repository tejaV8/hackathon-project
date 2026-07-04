import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { sidebarItems } from "./SidebarData";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const currentPage =
    sidebarItems.find((item) => item.path === location.pathname)?.title ?? "Home";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#09090B]/90 px-4 py-4 backdrop-blur-xl light:border-slate-200 light:bg-slate-50/90 sm:px-6 lg:px-7">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-zinc-200 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs text-zinc-500 light:text-slate-500">
              Workspace / {currentPage}
            </p>
            <h2 className="text-lg font-semibold text-white light:text-slate-950">
              {currentPage}
            </h2>
          </div>
        </div>

        <div className="relative hidden min-w-[260px] max-w-xl flex-1 md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search company knowledge..."
            className="w-full rounded-2xl border border-white/10 bg-[#111118] py-2.5 pl-10 pr-16 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400 light:border-slate-200 light:bg-white light:text-slate-950"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-zinc-400 light:bg-slate-100">
            Ctrl K
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="relative rounded-2xl border border-white/10 bg-[#111118] p-2.5 text-zinc-200 transition hover:border-violet-400/50 hover:bg-white/[0.1] light:border-slate-200 light:bg-white light:text-slate-700"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-400" />
          </button>

          <button
            type="button"
            className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#111118] py-1.5 pl-2 pr-3 transition hover:bg-white/[0.1] light:border-slate-200 light:bg-white sm:flex"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
              PS
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white light:text-slate-950">
                Priya Sharma
              </p>
              <p className="text-xs text-zinc-500 light:text-slate-500">
                Product Team
              </p>
            </div>
            <ChevronDown size={16} className="text-zinc-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
