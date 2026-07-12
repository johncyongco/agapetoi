import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { WeaknessCard } from "@/components/weaknesses/WeaknessCard";
import { WeaknessForm } from "@/components/weaknesses/WeaknessForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import type { Weakness } from "@/types";

export default function WeaknessesPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingWeakness, setEditingWeakness] = useState<Weakness | null>(
    null
  );
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const { weaknesses, archiveWeakness } = useWeaknessesStore();

  const filtered = weaknesses
    .filter((w) => w.status !== "archived")
    .filter((w) =>
      w.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const statusOrder = { active: 0, improving: 1, archived: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

  return (
    <div className="min-h-screen bg-bg">
      <Header title="Weaknesses" />

      <main className="max-w-4xl mx-auto px-5 lg:px-8 py-10 pb-24 lg:pb-12">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-editorial-5xl text-text mb-2">
              Weaknesses
            </h1>
            <p className="text-editorial-sm text-text-secondary">
              Name them to overcome them.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setEditingWeakness(null);
              setFormOpen(true);
            }}
            className="btn-primary shrink-0"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add
          </motion.button>
        </div>

        <hr className="editorial-rule-thick my-6" />

        <div className="mb-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search weaknesses..."
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={
              search ? "No results." : "No weaknesses yet."
            }
            description={
              search
                ? "Try a different search term."
                : "Adding weaknesses is the first step toward self-knowledge. They become your guide for daily growth."
            }
            action={
              !search ? (
                <button
                  onClick={() => setFormOpen(true)}
                  className="btn-primary"
                >
                  Add Your First Weakness
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {filtered.map((weakness, index) => (
              <div key={weakness.id} className="bg-bg">
                <WeaknessCard
                  weakness={weakness}
                  index={index}
                  onEdit={(w) => {
                    setEditingWeakness(w);
                    setFormOpen(true);
                  }}
                  onArchive={(id) => setArchivingId(id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <WeaknessForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingWeakness(null);
        }}
        editingWeakness={editingWeakness}
      />

      <ConfirmDialog
        isOpen={archivingId !== null}
        onClose={() => setArchivingId(null)}
        onConfirm={() => {
          if (archivingId) archiveWeakness(archivingId);
        }}
        title="Archive Weakness"
        message="This weakness will be archived and no longer appear in daily virtue suggestions."
        confirmLabel="Archive"
        danger
      />
    </div>
  );
}
