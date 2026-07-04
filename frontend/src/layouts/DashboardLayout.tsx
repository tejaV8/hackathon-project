import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import RightPanel from "../components/layout/RightPanel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090B] text-white light:bg-slate-50 light:text-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-7">
            <div className="mx-auto w-full max-w-[1680px]">{children}</div>
          </main>
        </div>

        <RightPanel />
      </div>
    </div>
  );
}
