import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeEffect } from "@/components/layout/ThemeEffect";
import HomePage from "@/pages/HomePage";
import WeaknessesPage from "@/pages/WeaknessesPage";
import VirtuesPage from "@/pages/VirtuesPage";
import JournalPage from "@/pages/JournalPage";
import InsightsPage from "@/pages/InsightsPage";
import ProfilePage from "@/pages/ProfilePage";
import ArchivePage from "@/pages/ArchivePage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeEffect />
      <div className="min-h-screen bg-bg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weaknesses" element={<WeaknessesPage />} />
          <Route path="/virtues" element={<VirtuesPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/archive" element={<ArchivePage />} />
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
