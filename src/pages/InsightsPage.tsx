import { Header } from "@/components/layout/Header";
import { InsightChart } from "@/components/insights/InsightChart";
import { useJournalStore } from "@/stores/journal-store";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { computeInsights } from "@/lib/insights";

export default function InsightsPage() {
  const { entries } = useJournalStore();
  const { weaknesses } = useWeaknessesStore();
  const insights = computeInsights(weaknesses, entries);

  return (
    <div className="app-background">
      <Header title="Insights" />

      <main className="max-w-3xl mx-auto px-5 lg:px-8 py-10 pb-24 lg:pb-12">
        <div className="mb-2">
          <h1 className="text-editorial-5xl text-text mb-2">Insights</h1>
          <p className="text-editorial-sm text-text-secondary">
            Patterns in your self-knowledge.
          </p>
        </div>

        <hr className="editorial-rule-thick my-6" />

        <InsightChart data={insights} />
      </main>
    </div>
  );
}
