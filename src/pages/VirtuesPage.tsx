import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { VirtueCard } from "@/components/virtues/VirtueCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { useVirtuesStore } from "@/stores/virtues-store";
import { getTodayVirtues } from "@/lib/virtue-mappings";

export default function VirtuesPage() {
  const navigate = useNavigate();
  const { weaknesses } = useWeaknessesStore();
  const { focusId, setFocus, customMappings } = useVirtuesStore();

  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const todayVirtues = getTodayVirtues(activeWeaknesses, customMappings, focusId);

  return (
    <div className="min-h-screen bg-bg">
      <Header title="Virtues" />

      <main className="max-w-4xl mx-auto px-5 lg:px-8 py-10 pb-24 lg:pb-12">
        <div className="mb-2">
          <h1 className="text-editorial-5xl text-text mb-2">
            Today's Virtues
          </h1>
          <p className="text-editorial-sm text-text-secondary">
            Practice virtue daily.
          </p>
        </div>

        <hr className="editorial-rule-thick my-6" />

        {todayVirtues.length === 0 ? (
          <EmptyState
            title="No virtues to practice yet."
            description="Add your weaknesses first. Each weakness suggests corresponding virtues for you to practice."
            action={
              <button
                onClick={() => navigate("/weaknesses")}
                className="btn-primary"
              >
                Add Weaknesses
              </button>
            }
          />
        ) : (
          <div>
            <motion.p
              className="text-editorial-sm text-text-secondary mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {todayVirtues.length}{" "}
              {todayVirtues.length === 1 ? "virtue" : "virtues"} to practice.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {todayVirtues.map((virtue, index) => (
                <div key={virtue.id} className="bg-bg">
                  <VirtueCard
                    virtue={virtue}
                    isFocus={focusId === virtue.id}
                    onSetFocus={(id) =>
                      setFocus(focusId === id ? null : id)
                    }
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
