import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  Trash2,
  Info,
  Moon,
  Sun,
  Monitor,
  Archive,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/ui-store";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { useJournalStore } from "@/stores/journal-store";
import { virtuesData } from "@/data/virtues-data";
import { computeInsights } from "@/lib/insights";
import type { Theme } from "@/types";

export default function ProfilePage() {
  const { settings, updateSettings } = useUIStore();
  const { weaknesses } = useWeaknessesStore();
  const { entries } = useJournalStore();

  const [nameEdit, setNameEdit] = useState(settings.name);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleNameSave = () => {
    updateSettings({ name: nameEdit.trim() });
  };

  const insights = computeInsights(weaknesses, entries);
  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const archivedWeaknesses = weaknesses.filter((w) => w.status === "archived");

  const handleExportTxt = () => {
    let txt = "AGAPETOI — JOURNAL EXPORT\n";
    txt += "==========================\n\n";
    txt += `Generated: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n\n`;

    txt += "WEAKNESSES\n";
    txt += "----------\n";
    if (activeWeaknesses.length === 0) {
      txt += "  (none)\n";
    } else {
      activeWeaknesses.forEach((w) => {
        const virtue = virtuesData.find((v) => v.id === w.virtue_id);
        txt += `  · ${w.title}`;
        if (virtue) txt += ` → ${virtue.name}`;
        if (w.description) txt += `\n    ${w.description}`;
        txt += "\n";
      });
    }
    txt += "\n";

    txt += "INSIGHTS\n";
    txt += "--------\n";
    if (insights.mostCommonWeakness) {
      txt += `  Most common weakness: ${insights.mostCommonWeakness.name} (${insights.mostCommonWeakness.count}x)\n`;
    }
    if (insights.mostPracticedVirtue) {
      txt += `  Most practiced virtue: ${insights.mostPracticedVirtue.name} (${insights.mostPracticedVirtue.count}x)\n`;
    }
    txt += `  Total entries: ${entries.length}\n\n`;

    txt += "JOURNAL ENTRIES\n";
    txt += "---------------\n";
    if (entries.length === 0) {
      txt += "  (none)\n";
    } else {
      entries.forEach((entry) => {
        const date = new Date(entry.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        txt += `\n${date}\n`;
        txt += "-".repeat(date.length) + "\n\n";
        txt += `Reflection:\n${entry.reflection}\n\n`;

        const entryWeaknesses = weaknesses.filter((w) =>
          entry.weakness_ids.includes(w.id)
        );
        if (entryWeaknesses.length > 0) {
          txt += `Weaknesses: ${entryWeaknesses.map((w) => w.title).join(", ")}\n\n`;
        }

        const entryVirtues = virtuesData.filter((v) =>
          entry.virtue_ids.includes(v.id)
        );
        if (entryVirtues.length > 0) {
          txt += `Virtues: ${entryVirtues.map((v) => v.name).join(", ")}\n\n`;
        }

        if (entry.lesson) txt += `Lesson:\n${entry.lesson}\n\n`;
        if (entry.tomorrow_practice)
          txt += `Tomorrow:\n${entry.tomorrow_practice}\n\n`;
      });
    }

    if (archivedWeaknesses.length > 0) {
      txt += "ARCHIVED WEAKNESSES\n";
      txt += "--------------------\n";
      archivedWeaknesses.forEach((w) => {
        txt += `  · ${w.title}\n`;
      });
      txt += "\n";
    }

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agapetoi-journal-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    let html = `<!DOCTYPE html>
<html><head><title>Agapetoi Journal</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500&display=swap');
  body { font-family: 'Inter', sans-serif; color: #1E1E1E; max-width: 700px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
  h1 { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; margin-bottom: 4px; }
  h2 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin-top: 40px; margin-bottom: 12px; border-bottom: 1px solid #DDDDD8; padding-bottom: 8px; }
  .subtitle { color: #757575; font-size: 14px; margin-bottom: 24px; }
  .date { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #757575; margin-bottom: 8px; margin-top: 40px; border-bottom: 1px solid #DDDDD8; padding-bottom: 8px; }
  .reflection { font-size: 15px; margin-bottom: 16px; }
  .section { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #757575; margin-bottom: 4px; margin-top: 16px; }
  .content { font-size: 14px; color: #444; }
  .item { font-size: 14px; padding: 6px 0; border-bottom: 1px solid #eee; }
  .item:last-child { border-bottom: none; }
  .stat { font-size: 13px; color: #666; }
  hr { border: none; border-top: 1px solid #DDDDD8; margin: 32px 0; }
  @media print { body { margin: 20px; } }
</style></head><body>
<h1>Agapetoi</h1>
<p class="subtitle">Journal Export — ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
<hr>`;

    html += `<h2>Weaknesses</h2>`;
    if (activeWeaknesses.length === 0) {
      html += `<p class="stat">(none)</p>`;
    } else {
      activeWeaknesses.forEach((w) => {
        const virtue = virtuesData.find((v) => v.id === w.virtue_id);
        html += `<div class="item"><strong>${w.title}</strong>`;
        if (virtue) html += ` <span style="color:#455C4B">→ ${virtue.name}</span>`;
        if (w.description) html += `<br><span style="color:#666">${w.description}</span>`;
        html += `</div>`;
      });
    }

    html += `<h2>Insights</h2>`;
    if (insights.mostCommonWeakness) {
      html += `<div class="item">Most common weakness: <strong>${insights.mostCommonWeakness.name}</strong> (${insights.mostCommonWeakness.count}x)</div>`;
    }
    if (insights.mostPracticedVirtue) {
      html += `<div class="item">Most practiced virtue: <strong>${insights.mostPracticedVirtue.name}</strong> (${insights.mostPracticedVirtue.count}x)</div>`;
    }
    html += `<div class="item">Total entries: ${entries.length}</div>`;

    html += `<h2>Journal Entries</h2>`;
    if (entries.length === 0) {
      html += `<p class="stat">(none)</p>`;
    } else {
      entries.forEach((entry) => {
        const date = new Date(entry.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const entryWeaknesses = weaknesses.filter((w) =>
          entry.weakness_ids.includes(w.id)
        );
        const entryVirtues = virtuesData.filter((v) =>
          entry.virtue_ids.includes(v.id)
        );

        html += `<div class="date">${date}</div>`;
        html += `<div class="reflection">${entry.reflection}</div>`;

        if (entryWeaknesses.length > 0) {
          html += `<div class="section">Weaknesses</div>`;
          html += `<div class="content">${entryWeaknesses.map((w) => w.title).join(", ")}</div>`;
        }
        if (entryVirtues.length > 0) {
          html += `<div class="section">Virtues</div>`;
          html += `<div class="content">${entryVirtues.map((v) => v.name).join(", ")}</div>`;
        }
        if (entry.lesson) {
          html += `<div class="section">Lesson</div>`;
          html += `<div class="content">${entry.lesson}</div>`;
        }
        if (entry.tomorrow_practice) {
          html += `<div class="section">Tomorrow</div>`;
          html += `<div class="content">${entry.tomorrow_practice}</div>`;
        }
      });
    }

    if (archivedWeaknesses.length > 0) {
      html += `<h2>Archived Weaknesses</h2>`;
      archivedWeaknesses.forEach((w) => {
        html += `<div class="item">${w.title}</div>`;
      });
    }

    html += `<hr><p style="font-size:11px;color:#aaa;text-align:center;margin-top:24px;">Exported from Agapetoi</p></body></html>`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500);
    }
  };

  const handleClearData = () => {
    localStorage.removeItem("agapetoi-weaknesses");
    localStorage.removeItem("agapetoi-journal");
    localStorage.removeItem("agapetoi-virtues");
    localStorage.removeItem("agapetoi-ui");
    window.location.reload();
  };

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun size={14} strokeWidth={1.5} /> },
    { value: "dark", label: "Dark", icon: <Moon size={14} strokeWidth={1.5} /> },
    { value: "system", label: "System", icon: <Monitor size={14} strokeWidth={1.5} /> },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Header title="Profile" />

      <main className="max-w-2xl mx-auto px-5 lg:px-0 py-10 pb-24 lg:pb-12">
        <div className="mb-2">
          <h1 className="text-editorial-5xl text-text mb-2">Profile</h1>
        </div>

        <hr className="editorial-rule-thick my-6" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          <div>
            <label className="label-caps block mb-3">Name</label>
            <input
              type="text"
              value={nameEdit}
              onChange={(e) => setNameEdit(e.target.value)}
              onBlur={handleNameSave}
              placeholder="Your name"
              className="input-minimal text-lg"
            />
          </div>

          <div>
            <p className="label-caps mb-3">Theme</p>
            <div className="flex gap-px bg-border">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateSettings({ theme: t.value })}
                  className={`flex items-center gap-2 px-5 py-3 text-editorial-sm transition-colors flex-1 justify-center ${
                    settings.theme === t.value
                      ? "bg-text text-bg"
                      : "bg-bg text-text-secondary hover:text-text"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label-caps mb-4">Data</p>
            <div className="space-y-0">
              <button
                onClick={handleExportTxt}
                className="w-full flex items-center gap-3 py-3.5 border-b border-border text-left text-editorial-sm text-text hover:bg-paper transition-colors"
              >
                <Download size={14} strokeWidth={1.5} className="text-text-secondary" />
                Export Journal (TXT)
              </button>
              <button
                onClick={handleExportPdf}
                className="w-full flex items-center gap-3 py-3.5 border-b border-border text-left text-editorial-sm text-text hover:bg-paper transition-colors"
              >
                <Download size={14} strokeWidth={1.5} className="text-text-secondary" />
                Export Journal (PDF)
              </button>
              <Link
                to="/archive"
                className="w-full flex items-center gap-3 py-3.5 border-b border-border text-left text-editorial-sm text-text hover:bg-paper transition-colors"
              >
                <Archive size={14} strokeWidth={1.5} className="text-text-secondary" />
                Archive
                {archivedWeaknesses.length > 0 && (
                  <span className="ml-auto text-editorial-xs text-text-secondary">
                    {archivedWeaknesses.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center gap-3 py-3.5 border-b border-border text-left text-editorial-sm text-danger hover:bg-paper transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.5} />
                Clear All Data
              </button>
              <button
                onClick={() => setShowAbout(true)}
                className="w-full flex items-center gap-3 py-3.5 text-left text-editorial-sm text-text hover:bg-paper transition-colors"
              >
                <Info size={14} strokeWidth={1.5} className="text-text-secondary" />
                About Agapetoi
              </button>
            </div>
          </div>

          <div className="pt-6">
            <hr className="editorial-rule mb-6" />
            <p className="text-editorial-xs text-text-secondary tracking-widest uppercase">
              Agapetoi
            </p>
            <p className="text-editorial-xs text-text-secondary mt-1">
              {activeWeaknesses.length} weaknesses · {entries.length} entries
            </p>
          </div>
        </motion.div>
      </main>

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="This will permanently delete all your weaknesses, journal entries, and settings. This cannot be undone."
        confirmLabel="Clear Everything"
        danger
      />

      <Modal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title="About"
      >
        <div className="space-y-4 text-editorial-sm text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text font-medium">Agapetoi</strong>{" "}
            (Greek: ἀγαπητοί) means <em>Beloved</em>.
          </p>
          <p>
            This app helps you know yourself honestly by identifying
            recurring weaknesses, cultivating corresponding virtues, and
            reflecting briefly each day.
          </p>
          <p>
            Every weakness has a corresponding virtue. Instead of obsessing
            over failures, Agapetoi gently redirects you toward the virtue
            you are called to practice.
          </p>
          <hr className="editorial-rule" />
          <p className="text-editorial-xs text-text-secondary">
            Version 1.0.0
          </p>
        </div>
      </Modal>
    </div>
  );
}
