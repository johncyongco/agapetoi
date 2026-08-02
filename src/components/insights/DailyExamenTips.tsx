import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Heart,
  Lightbulb,
  RotateCcw,
  Sunrise,
  Flame,
} from "lucide-react";
import type { ExamenResponse } from "@/types";

const steps = [
  {
    icon: Sunrise,
    title: "Become present",
    tip: "Pause and remember that God is here with you. Ask to see this day with loving attention.",
    prompt: "Where do you notice God's presence right now?",
  },
  {
    icon: Heart,
    title: "Give thanks",
    tip: "Name the gifts, people, moments, and graces for which you are grateful today.",
    prompt: "What gift from today can you receive with gratitude?",
  },
  {
    icon: Lightbulb,
    title: "Ask for light",
    tip: "Invite the Holy Spirit to show you the movements of your heart without fear or self-deception.",
    prompt: "What do you need grace to see clearly?",
  },
  {
    icon: Eye,
    title: "Review the day",
    tip: "Look back slowly. Notice consolation and desolation, where you moved toward love, and where you turned away.",
    prompt: "When did you move toward love, and when did you turn away?",
  },
  {
    icon: RotateCcw,
    title: "Receive mercy and look ahead",
    tip: "Ask forgiveness, receive God's mercy, and choose one concrete grace-filled resolution for tomorrow.",
    prompt: "What one concrete grace will you ask for tomorrow?",
  },
];

interface DailyExamenTipsProps {
  initialResponses?: ExamenResponse[];
  onSave: (responses: ExamenResponse[]) => void;
  candleMode: boolean;
  onToggleCandle: () => void;
}

export function DailyExamenTips({
  initialResponses,
  onSave,
  candleMode,
  onToggleCandle,
}: DailyExamenTipsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() =>
    initialResponses ? steps.map((_, index) => index) : []
  );
  const [responses, setResponses] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      (initialResponses || []).map((item, index) => [index, item.response])
    )
  );
  const [isFinished, setIsFinished] = useState(Boolean(initialResponses));
  const step = steps[activeStep] || steps[0];
  const StepIcon = step.icon;
  const isComplete = completedSteps.includes(activeStep);
  const reflection = responses[activeStep] || "";

  const handleSave = () => {
    onSave(
      steps.map((item, index) => ({
        step: item.title,
        prompt: item.prompt,
        response: responses[index] || "",
      }))
    );
    setIsFinished(true);
  };

  const toggleComplete = () => {
    if (isComplete) {
      setCompletedSteps((current) =>
        current.filter((index) => index !== activeStep)
      );
      return;
    }

    const nextCompleted = [...new Set([...completedSteps, activeStep])];
    setCompletedSteps(nextCompleted);

    if (steps.every((_, index) => nextCompleted.includes(index))) {
      handleSave();
    } else {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }
  };

  const moveStep = (direction: number) => {
    setActiveStep((current) =>
      Math.min(Math.max(current + direction, 0), steps.length - 1)
    );
  };

  if (isFinished) {
    return (
      <section className="candle-focus-content" aria-labelledby="examen-tips-title">
        <div className="border border-border bg-paper px-6 py-7 sm:px-8 sm:py-8">
          <p className="label-caps mb-2">Today's practice</p>
          <h2 id="examen-tips-title" className="text-editorial-3xl text-text mb-3">
            Examen complete.
          </h2>
          <p className="text-editorial-sm text-text-secondary leading-relaxed">
            Your reflection is saved. Open today&apos;s marked date below to review,
            export, or archive it.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="candle-focus-content" aria-labelledby="examen-tips-title">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="label-caps mb-2">Ignatian practice</p>
          <h2 id="examen-tips-title" className="text-editorial-3xl text-text">
            Five quiet minutes
          </h2>
        </div>
        <span className="hidden sm:block text-editorial-xs text-text-secondary text-right max-w-[150px]">
          A prayerful rhythm from St. Ignatius of Loyola
        </span>
      </div>

      <div className="mb-5 flex items-center gap-2" aria-label="Examen progress">
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Go to step ${index + 1}: ${item.title}`}
            aria-current={index === activeStep ? "step" : undefined}
            onClick={() => {
              setActiveStep(index);
            }}
            className={`h-2 flex-1 rounded-full border border-border transition-colors ${
              completedSteps.includes(index) || index === activeStep
                ? "bg-text"
                : "bg-paper"
            }`}
          />
        ))}
      </div>

      <div className="candle-interactive-card relative border border-border bg-paper px-6 py-7 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={onToggleCandle}
          aria-pressed={candleMode}
          aria-label={candleMode ? "Turn off candlelight mode" : "Turn on candlelight mode"}
          title={candleMode ? "Turn off candlelight mode" : "Candlelight Examen"}
          className="candle-toggle absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-paper text-text transition-all"
        >
          <Flame
            size={17}
            strokeWidth={1.6}
            className={`candle-flame ${candleMode ? "candle-flame-active" : ""}`}
          />
        </button>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text">
              <StepIcon size={18} strokeWidth={1.6} />
            </div>
            <div>
              <p className="label-caps mb-1">
                Step {activeStep + 1} of {steps.length}
              </p>
              <h3 className="text-editorial-2xl text-text">{step.title}</h3>
            </div>
          </div>
          {isComplete && <Check size={18} className="text-text" aria-label="Completed" />}
        </div>

        <p className="text-editorial-sm text-text-secondary leading-relaxed mb-6">
          {step.tip}
        </p>

        <label className="label-caps block mb-2" htmlFor="examen-reflection">
          Quiet prompt
        </label>
        <p className="text-editorial-lg text-text mb-3">{step.prompt}</p>
        <textarea
          id="examen-reflection"
          value={reflection}
          onChange={(event) => {
            setResponses((current) => ({
              ...current,
              [activeStep]: event.target.value,
            }));
          }}
          placeholder="Write a few words, or remain in silence."
          rows={3}
          className="textarea-minimal mb-6"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => moveStep(-1)}
            disabled={activeStep === 0}
            className="flex items-center gap-2 text-editorial-sm text-text-secondary hover:text-text disabled:opacity-40"
          >
            <ArrowLeft size={14} />
            Previous
          </button>
          <button
            type="button"
            onClick={toggleComplete}
            className={`flex items-center gap-2 px-4 py-2.5 text-editorial-sm border transition-colors ${
              isComplete
                ? "bg-text text-bg border-text"
                : "bg-paper text-text border-border hover:border-text"
            }`}
          >
            <Check size={14} />
            {isComplete ? "Completed" : "Mark complete"}
          </button>
          <button
            type="button"
            onClick={() => moveStep(1)}
            disabled={activeStep === steps.length - 1}
            className="flex items-center gap-2 text-editorial-sm text-text-secondary hover:text-text disabled:opacity-40"
          >
            Next
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-editorial-xs text-text-secondary">
          {completedSteps.length} of {steps.length} steps completed
        </p>
      </div>
    </section>
  );
}
