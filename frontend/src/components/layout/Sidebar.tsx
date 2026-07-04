import { BrainCircuit } from "lucide-react";
import { sidebarItems } from "./sidebarData";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#0F0F17] border-r border-zinc-800 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-8">

        <div className="flex items-center gap-3">

          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">

            <BrainCircuit className="text-white" size={26} />

          </div>

          <div>

            <h1 className="font-bold text-xl">
              AI Company Brain
            </h1>

            <p className="text-sm text-zinc-400">
              Enterprise AI Assistant
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="px-4 space-y-2 flex-1">

        {sidebarItems.map((item, index) => {

          const Icon = item.icon;

          return (

            <button
              key={item.title}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300

              ${
                index === 0
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >

              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>

            </button>

          );

        })}

      </nav>

      {/* Status Card */}

      <div className="p-4">

        <div className="rounded-3xl bg-[#18181F] border border-zinc-800 p-5">

          <h3 className="font-semibold">
            AI Brain Status
          </h3>

          <div className="flex items-center gap-2 mt-3">

            <div className="w-2 h-2 rounded-full bg-green-500"></div>

            <span className="text-sm text-green-400">
              All systems operational
            </span>

          </div>

          <div className="mt-8 flex justify-center">

            <div className="w-24 h-24 rounded-full bg-violet-600 blur-3xl opacity-30 absolute"></div>

            <BrainCircuit
              size={70}
              className="relative text-violet-400"
            />

          </div>

          <button className="mt-8 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition">

            Sync Now

          </button>

        </div>

      </div>

    </aside>
  );
}