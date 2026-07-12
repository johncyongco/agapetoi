import { useState, useEffect } from "react";
import type { JournalEntry } from "@/types";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { useJournalStore } from "@/stores/journal-store";
import { useVirtuesStore } from "@/stores/virtues-store";
import { getTodayVirtues } from "@/lib/virtue-mappings";

interface JournalEditFormProps {
  entry: JournalEntry;
  onClose: () => void;
}

export function JournalEditForm({ entry, onClose }: JournalEditFormProps) {
  const [reflection, setReflection] = useState(entry.reflection);
  const [selectedWeaknessIds, setSelectedWeaknessIds] = useState<string[]>(entry.weakness_ids);
  const [selectedVirtueIds, setSelectedVirtueIds] = useState<string[]>(entry.virtue_ids);
  const [lesson, setLesson] = useState(entry.lesson);
  const [tomorrowPractice, setTomorrowPractice] = useState(entry.tomorrow_practice);

  const { weaknesses } = useWeaknessesStore();
  const { updateEntry } = useJournalStore();
  const { customMappings } = useVirtuesStore();

  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const todayVirtues = getTodayVirtues(activeWeaknesses, customMappings);

  const toggleWeakness = (id: string) => {
    setSelectedWeaknessIds((prev) =>
      prev.includes(id) ? prev.filter((wId) => wId !== id) : [...prev, id]
    );
  };

  const toggleVirtue = (id: string) => {
    setSelectedVirtueIds((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    updateEntry(entry.id, {
      reflection,
      weakness_ids: selectedWeaknessIds,
      virtue_ids: selectedVirtueIds,
      lesson,
      tomorrow_practice: tomorrowPractice,
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label-caps block mb-1.5">What happened?</label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
          className="textarea-minimal"
        />
      </div>

      <div>
        <label className="label-caps block mb-1.5">Weaknesses</label>
        {activeWeaknesses.length === 0 ? (
          <p className="text-editorial-xs text-text-secondary italic">No weaknesses added.</p>
        ) : (
          <div className="space-y-0">
            {activeWeaknesses.map((w) => (
              <button
                key={w.id}
                onClick={() => toggleWeakness(w.id)}
                className="w-full flex items-center gap-3 py-2 border-b border-border text-left transition-colors hover:bg-paper"
              >
                <div
                  className={`w-3 h-3 border transition-colors flex items-center justify-center ${
                    selectedWeaknessIds.includes(w.id)
                      ? "bg-text border-text"
                      : "border-border"
                  }`}
                >
                  {selectedWeaknessIds.includes(w.id) && (
                    <span className="text-white text-[8px]">✓</span>
                  )}
                </div>
                <span className="text-editorial-sm text-text">{w.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="label-caps block mb-1.5">Virtues practiced</label>
        <div className="space-y-0">
          {todayVirtues.map((v) => (
            <button
              key={v.id}
              onClick={() => toggleVirtue(v.id)}
              className="w-full flex items-center gap-3 py-2 border-b border-border text-left transition-colors hover:bg-paper"
            >
              <div
                className={`w-3 h-3 border transition-colors flex items-center justify-center ${
                  selectedVirtueIds.includes(v.id)
                    ? "bg-text border-text"
                    : "border-border"
                }`}
              >
                {selectedVirtueIds.includes(v.id) && (
                  <span className="text-white text-[8px]">✓</span>
                )}
              </div>
              <span className="text-editorial-sm text-text">{v.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-caps block mb-1.5">Lesson</label>
        <textarea
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          rows={2}
          className="textarea-minimal"
        />
      </div>

      <div>
        <label className="label-caps block mb-1.5">Tomorrow</label>
        <textarea
          value={tomorrowPractice}
          onChange={(e) => setTomorrowPractice(e.target.value)}
          rows={1}
          className="textarea-minimal"
        />
      </div>

      <hr className="editorial-rule" />

      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">
          Cancel
        </button>
        <button onClick={handleSave} className="btn-primary flex-1">
          Save Changes
        </button>
      </div>
    </div>
  );
}
