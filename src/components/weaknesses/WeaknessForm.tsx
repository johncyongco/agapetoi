import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Weakness } from "@/types";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { Modal } from "@/components/ui/Modal";
import { virtuesData } from "@/data/virtues-data";
import {
  defaultWeaknesses,
  weaknessCategories,
  type WeaknessCategory,
} from "@/data/weaknesses-data";

const schema = z.object({
  title: z.string().min(1, "Select a weakness"),
  description: z.string().max(200).optional(),
  severity: z.number().min(1).max(5),
  status: z.enum(["active", "improving", "archived"]),
  virtue_id: z.string().min(1, "Select a virtue"),
});

type FormData = z.infer<typeof schema>;

interface WeaknessFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingWeakness?: Weakness | null;
}

export function WeaknessForm({
  isOpen,
  onClose,
  editingWeakness,
}: WeaknessFormProps) {
  const { addWeakness, updateWeakness, weaknesses } = useWeaknessesStore();

  const usedTitles = new Set(weaknesses.map((w) => w.title));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: editingWeakness
      ? {
          title: editingWeakness.title,
          description: editingWeakness.description,
          severity: editingWeakness.severity,
          status: editingWeakness.status,
          virtue_id: editingWeakness.virtue_id || "",
        }
      : {
          title: "",
          description: "",
          severity: 3,
          status: "active",
          virtue_id: "",
        },
  });

  const currentSeverity = watch("severity");
  const currentTitle = watch("title");

  useEffect(() => {
    if (editingWeakness || !currentTitle) return;
    const template = defaultWeaknesses.find((w) => w.title === currentTitle);
    if (template) {
      setValue("description", template.description);
      setValue("severity", template.severity);
      setValue("virtue_id", template.mapped_virtue);
    }
  }, [currentTitle, editingWeakness, setValue]);

  const onSubmit = (data: FormData) => {
    const template = defaultWeaknesses.find((w) => w.title === data.title);
    if (editingWeakness) {
      updateWeakness(editingWeakness.id, {
        ...data,
        severity: data.severity as 1 | 2 | 3 | 4 | 5,
        category: template?.category || editingWeakness.category,
        symptoms: template?.symptoms || editingWeakness.symptoms,
        reflection_questions: template?.reflection_questions || editingWeakness.reflection_questions,
        practice: template?.practice || editingWeakness.practice,
        scripture: template?.scripture || editingWeakness.scripture,
        saints_wisdom: template?.saints_wisdom || editingWeakness.saints_wisdom,
        related_weaknesses: template?.related_weaknesses || editingWeakness.related_weaknesses,
      });
    } else {
      addWeakness({
        user_id: "local",
        title: data.title,
        description: data.description || template?.description || "",
        severity: data.severity as 1 | 2 | 3 | 4 | 5,
        status: data.status,
        virtue_id: data.virtue_id,
        category: template?.category || "",
        symptoms: template?.symptoms || [],
        reflection_questions: template?.reflection_questions || [],
        practice: template?.practice || "",
        scripture: template?.scripture || "",
        saints_wisdom: template?.saints_wisdom || "",
        related_weaknesses: template?.related_weaknesses || [],
      });
    }
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWeakness ? "Edit Weakness" : "Add Weakness"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="label-caps block mb-2">Weakness</label>
          <select
            {...register("title")}
            className="input-outlined"
            disabled={!!editingWeakness}
          >
            <option value="">Select a weakness...</option>
            {weaknessCategories.map((cat) => (
              <optgroup key={cat} label={cat}>
                {defaultWeaknesses
                  .filter(
                    (w) =>
                      w.category === cat &&
                      (editingWeakness || !usedTitles.has(w.title))
                  )
                  .map((w) => (
                    <option key={w.title} value={w.title}>
                      {w.title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          {errors.title && (
            <p className="text-editorial-xs text-danger mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="label-caps block mb-2">
            Description (optional)
          </label>
          <textarea
            {...register("description")}
            rows={2}
            placeholder="Briefly describe this weakness..."
            className="input-outlined resize-none"
          />
        </div>

        <div>
          <label className="label-caps block mb-2">Corresponding Virtue</label>
          <select
            {...register("virtue_id")}
            className="input-outlined"
          >
            <option value="">Select a virtue...</option>
            {virtuesData.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          {errors.virtue_id && (
            <p className="text-editorial-xs text-danger mt-1">
              {errors.virtue_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="label-caps block mb-3">
            Severity: {currentSeverity} / 5
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("severity", s as 1 | 2 | 3 | 4 | 5)}
                className={`flex-1 py-2.5 text-editorial-xs rounded-none border transition-all ${
                  currentSeverity === s
                    ? "bg-text text-bg border-text"
                    : "bg-paper text-text-secondary border-border hover:border-text"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <hr className="editorial-rule" />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1">
            {editingWeakness ? "Save Changes" : "Add Weakness"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
