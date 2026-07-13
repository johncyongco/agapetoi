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
  const { customMappings, focusId } = useVirtuesStore();

  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const todayVirtues = getTodayVirtues(activeWeaknesses, customMappings, focusId);

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
          <div>
            <p className="text-editorial-xs text-text-secondary mb-2">
              {selectedWeaknessIds.length} selected
            </p>
            <select
              multiple
              value={selectedWeaknessIds}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
                setSelectedWeaknessIds(values);
              }}
              className="w-full min-h-[140px] border border-border bg-bg text-text text-editorial-sm p-3 focus:outline-none focus:border-text"
            >
              {activeWeaknesses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
            <p className="text-editorial-xs text-text-secondary mt-2 italic">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="label-caps block mb-1.5">Virtues practiced</label>
        <div>
          <p className="text-editorial-xs text-text-secondary mb-2">
            {selectedVirtueIds.length} selected
          </p>
          <select
            multiple
            value={selectedVirtueIds}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
              setSelectedVirtueIds(values);
            }}
            className="w-full min-h-[140px] border border-border bg-bg text-text text-editorial-sm p-3 focus:outline-none focus:border-text"
          >
            {todayVirtues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <p className="text-editorial-xs text-text-secondary mt-2 italic">
            Hold Ctrl/Cmd to select multiple
          </p>
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
