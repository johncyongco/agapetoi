import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { useJournalStore } from "@/stores/journal-store";
import { useVirtuesStore } from "@/stores/virtues-store";
import { getTodayVirtues } from "@/lib/virtue-mappings";

interface JournalWizardProps {
  onClose: () => void;
}

type Step = "reflection" | "weaknesses" | "virtues" | "lesson";

const steps: Step[] = ["reflection", "weaknesses", "virtues", "lesson"];

export function JournalWizard({ onClose }: JournalWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>("reflection");
  const [reflection, setReflection] = useState("");
  const [selectedWeaknessIds, setSelectedWeaknessIds] = useState<string[]>(
    []
  );
  const [selectedVirtueIds, setSelectedVirtueIds] = useState<string[]>([]);
  const [lesson, setLesson] = useState("");
  const [saved, setSaved] = useState(false);

  const { weaknesses } = useWeaknessesStore();
  const { addEntry } = useJournalStore();
  const { customMappings } = useVirtuesStore();

  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const todayVirtues = getTodayVirtues(activeWeaknesses, customMappings);

  const currentIndex = steps.indexOf(currentStep);

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
    addEntry({
      user_id: "local",
      reflection,
      weakness_ids: selectedWeaknessIds,
      virtue_ids: selectedVirtueIds,
      lesson,
      tomorrow_practice: "",
    });
    setSaved(true);
    setTimeout(() => onClose(), 1200);
  };

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      handleSave();
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (saved) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-editorial-4xl text-text mb-2">Saved.</h3>
        <p className="text-editorial-sm text-text-secondary">
          Another step toward knowing yourself.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-[420px]">
      <div className="flex items-center gap-3 mb-8">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i <= currentIndex ? "bg-text" : "bg-border"
              }`}
            />
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-px transition-colors duration-300 ${
                  i < currentIndex ? "bg-text" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {currentStep === "reflection" && (
            <div>
              <h3 className="text-editorial-3xl text-text mb-2">
                What happened?
              </h3>
              <p className="text-editorial-sm text-text-secondary mb-6">
                Reflect briefly on your day.
              </p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={5}
                placeholder="Write about your day..."
                className="textarea-minimal text-lg"
                autoFocus
              />
            </div>
          )}

          {currentStep === "weaknesses" && (
            <div>
              <h3 className="text-editorial-3xl text-text mb-2">
                Which weakness appeared?
              </h3>
              <p className="text-editorial-sm text-text-secondary mb-6">
                Select any you noticed today.
              </p>
              {activeWeaknesses.length === 0 ? (
                <p className="text-editorial-sm text-text-secondary italic">
                  No weaknesses added yet.
                </p>
              ) : (
                <div className="space-y-0">
                  {activeWeaknesses.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => toggleWeakness(w.id)}
                      className="w-full flex items-center gap-4 py-3 border-b border-border text-left transition-colors hover:bg-paper"
                    >
                      <div
                        className={`w-4 h-4 border transition-colors flex items-center justify-center ${
                          selectedWeaknessIds.includes(w.id)
                            ? "bg-text border-text"
                            : "border-border"
                        }`}
                      >
                        {selectedWeaknessIds.includes(w.id) && (
                          <span className="text-white text-[10px]">✓</span>
                        )}
                      </div>
                      <span className="text-editorial-sm text-text">
                        {w.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === "virtues" && (
            <div>
              <h3 className="text-editorial-3xl text-text mb-2">
                Which virtue did you practice?
              </h3>
              <p className="text-editorial-sm text-text-secondary mb-6">
                Select the virtues you consciously practiced.
              </p>
              <div className="space-y-0">
                {todayVirtues.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => toggleVirtue(v.id)}
                    className="w-full flex items-center gap-4 py-3 border-b border-border text-left transition-colors hover:bg-paper"
                  >
                    <div
                      className={`w-4 h-4 border transition-colors flex items-center justify-center ${
                        selectedVirtueIds.includes(v.id)
                          ? "bg-text border-text"
                          : "border-border"
                      }`}
                    >
                      {selectedVirtueIds.includes(v.id) && (
                        <span className="text-white text-[10px]">✓</span>
                      )}
                    </div>
                    <span className="text-editorial-sm text-text">
                      {v.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "lesson" && (
            <div>
              <h3 className="text-editorial-3xl text-text mb-2">
                One lesson.
              </h3>
              <p className="text-editorial-sm text-text-secondary mb-6">
                What did you learn about yourself?
              </p>
              <textarea
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                rows={4}
                placeholder="I noticed that..."
                className="textarea-minimal text-lg"
                autoFocus
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <button
          onClick={currentIndex === 0 ? onClose : goBack}
          className="text-editorial-sm text-text-secondary hover:text-text transition-colors"
        >
          {currentIndex === 0 ? "Cancel" : "← Back"}
        </button>

        <button
          onClick={goNext}
          disabled={
            currentStep === "reflection" && reflection.trim().length === 0
          }
          className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {currentStep === "lesson" ? "Save" : "Continue"}
          <ArrowRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
