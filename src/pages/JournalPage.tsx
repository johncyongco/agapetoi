import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { JournalWizard } from "@/components/journal/JournalWizard";
import { JournalEditForm } from "@/components/journal/JournalEditForm";
import { ReflectionCard } from "@/components/journal/ReflectionCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useJournalStore } from "@/stores/journal-store";
import type { JournalEntry } from "@/types";

export default function JournalPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { entries, removeEntry } = useJournalStore();

  return (
    <div className="min-h-screen bg-bg">
      <Header title="Journal" />

      <main className="max-w-2xl mx-auto px-5 lg:px-0 py-10 pb-24 lg:pb-12">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-editorial-5xl text-text mb-2">Journal</h1>
            <p className="text-editorial-sm text-text-secondary">
              Brief daily reflections.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setWizardOpen(true)}
            className="btn-primary shrink-0"
          >
            <Plus size={14} strokeWidth={1.5} />
            New Entry
          </motion.button>
        </div>

        <hr className="editorial-rule-thick my-6" />

        {entries.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16">
            <h3 className="text-editorial-4xl text-text mb-3">
              No reflections yet.
            </h3>
            <p className="text-editorial-sm text-text-secondary leading-relaxed max-w-sm mb-8">
              Start by writing what happened today. Each entry takes less
              than three minutes.
            </p>
            <button
              onClick={() => setWizardOpen(true)}
              className="btn-primary"
            >
              New Entry
            </button>
          </div>
        ) : (
          <div className="space-y-px bg-border">
            {entries.map((entry, index) => (
              <div key={entry.id} className="bg-bg">
                <ReflectionCard
                  entry={entry}
                  index={index}
                  onEdit={(e) => setEditingEntry(e)}
                  onDelete={(id) => setDeletingId(id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Daily Reflection"
      >
        <JournalWizard onClose={() => setWizardOpen(false)} />
      </Modal>

      <Modal
        isOpen={editingEntry !== null}
        onClose={() => setEditingEntry(null)}
        title="Edit Entry"
        maxWidth="max-w-md"
      >
        {editingEntry && (
          <JournalEditForm
            entry={editingEntry}
            onClose={() => setEditingEntry(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) removeEntry(deletingId);
        }}
        title="Delete Entry"
        message="This reflection will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
