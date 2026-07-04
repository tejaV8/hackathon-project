import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 border-b border-zinc-800 bg-[#0F0F17] px-8 flex items-center justify-between">

      {/* Search */}

      <div className="relative w-[550px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Search across your company knowledge..."
          className="
          w-full
          rounded-2xl
          bg-[#18181F]
          border
          border-zinc-700
          py-3
          pl-12
          pr-20
          text-white
          placeholder:text-zinc-500
          outline-none
          transition
          focus:border-violet-500
          "
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">

          <div className="rounded-lg bg-zinc-700 px-2 py-1 text-xs text-zinc-300">

            Ctrl K

          </div>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Theme */}

        <button className="rounded-xl bg-[#18181F] p-3 hover:bg-zinc-700 transition">

          🌙

        </button>

        {/* Notification */}

        <button className="relative">

          <Bell size={22} />

          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-violet-500"></span>

        </button>

        {/* User */}

        <div className="flex items-center gap-3 cursor-pointer">

          <img
            src="https://i.pravatar.cc/100"
            className="w-11 h-11 rounded-full"
          />

          <div>

            <p className="font-semibold">

              Priya Sharma

            </p>

            <p className="text-sm text-zinc-400">

              Product Team

            </p>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
}