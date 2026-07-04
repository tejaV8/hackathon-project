import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import AskBrain from "./pages/AskBrain";
import Documents from "./pages/Documents";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/home" element={<Home />} />
          <Route path="/brain" element={<AskBrain />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/knowledge" element={<KnowledgeGraph />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}