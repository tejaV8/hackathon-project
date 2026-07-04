import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import RightPanel from "../components/layout/RightPanel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#09090B] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

      <RightPanel />
    </div>
  );
}