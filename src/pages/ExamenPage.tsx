import { useEffect, useMemo, useState } from "react";
import { Archive, ChevronLeft, ChevronRight, Download, Pencil, RotateCcw, Save, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { DailyExamenTips } from "@/components/insights/DailyExamenTips";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useExamenStore, getLocalDateKey } from "@/stores/examen-store";
import type { ExamenEntry, ExamenResponse } from "@/types";

function formatDate(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getEntryText(entry: ExamenEntry): string {
  return [
    "AGAPETOI - DAILY EXAMEN",
    "=======================",
    "",
    formatDate(entry.date),
    "",
    ...entry.responses.flatMap((item, index) => [
      `${index + 1}. ${item.step}`,
      item.prompt,
      item.response || "(No written response)",
      "",
    ]),
  ].join("\n");
}

function downloadText(entry: ExamenEntry): void {
  const blob = new Blob([getEntryText(entry)], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `agapetoi-examen-${entry.date}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printEntry(entry: ExamenEntry): void {
  const responseHtml = entry.responses
    .map(
      (item, index) => `
        <section>
          <h2>${index + 1}. ${escapeHtml(item.step)}</h2>
          <p class="prompt">${escapeHtml(item.prompt)}</p>
          <p>${escapeHtml(item.response || "No written response.")}</p>
        </section>`
    )
    .join("");
  const html = `<!DOCTYPE html><html><head><title>Agapetoi Daily Examen</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1E1E1E; max-width: 700px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
      h1 { font-family: Georgia, serif; font-weight: 400; margin-bottom: 4px; }
      h2 { font-family: Georgia, serif; font-weight: 400; border-bottom: 1px solid #DDDDD8; padding-bottom: 6px; margin-top: 28px; }
      .date, .prompt { color: #78716C; }
      .date { text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
      @media print { body { margin: 20px; } }
    </style></head><body>
    <h1>Daily Examen</h1><p class="date">${escapeHtml(formatDate(entry.date))}</p>${responseHtml}
    </body></html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const iframeDocument = iframe.contentWindow?.document;
  if (iframeDocument) {
    iframeDocument.open();
    iframeDocument.write(html);
    iframeDocument.close();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  }
}

function ExamenEntryModal({
  entry,
  onClose,
  onArchive,
  onRestore,
  onUpdate,
  onDelete,
}: {
  entry: ExamenEntry | undefined;
  onClose: () => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onUpdate: (id: string, responses: ExamenResponse[]) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [responses, setResponses] = useState<ExamenResponse[]>(entry?.responses || []);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setEditing(false);
    setResponses(entry?.responses || []);
    setConfirmDelete(false);
  }, [entry?.id, entry?.responses]);

  const handleSave = () => {
    if (!entry) return;
    onUpdate(entry.id, responses);
    setEditing(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={entry !== undefined}
        onClose={onClose}
        title="Saved Examen"
        maxWidth={editing ? "max-w-[25rem]" : "max-w-2xl"}
        maxHeight="max-h-[calc(100dvh-6rem)] overflow-y-auto"
      >
        {entry && (
          <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="label-caps mb-1">{formatDate(entry.date)}</p>
              {entry.archived && (
                <p className="text-editorial-xs text-text-secondary">Archived</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-editorial-xs text-text-secondary hover:text-text"
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
              <button
                type="button"
                onClick={() => downloadText(entry)}
                className="flex items-center gap-1.5 text-editorial-xs text-text-secondary hover:text-text"
              >
                <Download size={13} /> TXT
              </button>
              <button
                type="button"
                onClick={() => printEntry(entry)}
                className="flex items-center gap-1.5 text-editorial-xs text-text-secondary hover:text-text"
              >
                <Download size={13} /> PDF
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {responses.map((item, index) => (
              <section key={item.step}>
                <p className="label-caps mb-1">{index + 1}. {item.step}</p>
                <p className="text-editorial-xs text-text-secondary mb-2">{item.prompt}</p>
                {editing ? (
                  <textarea
                    value={item.response}
                    onChange={(event) =>
                      setResponses((current) =>
                        current.map((response, responseIndex) =>
                          responseIndex === index
                            ? { ...response, response: event.target.value }
                            : response
                        )
                      )
                    }
                    rows={3}
                    className="textarea-minimal"
                  />
                ) : (
                  <p className="text-editorial-sm text-text leading-relaxed">
                    {item.response || "No written response."}
                  </p>
                )}
              </section>
            ))}
          </div>

          <hr className="editorial-rule my-6" />
          {editing ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setResponses(entry.responses);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="btn-primary">
                <Save size={14} /> Save changes
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              {entry.archived ? (
                <button
                  type="button"
                  onClick={() => onRestore(entry.id)}
                  className="flex items-center gap-2 text-editorial-sm text-text-secondary hover:text-text"
                >
                  <RotateCcw size={14} /> Restore from archive
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onArchive(entry.id)}
                  className="flex items-center gap-2 text-editorial-sm text-text-secondary hover:text-text"
                >
                  <Archive size={14} /> Archive this Examen
                </button>
              )}
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 text-editorial-sm text-danger hover:opacity-80"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
          </div>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (entry) {
            onDelete(entry.id);
            onClose();
          }
        }}
        title="Delete Examen"
        message="This saved Examen will be permanently deleted from this device. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}

export default function ExamenPage() {
  const { entries, saveEntry, updateEntry, archiveEntry, restoreEntry, removeEntry } = useExamenStore();
  const todayKey = getLocalDateKey();
  const todayEntry = entries.find((entry) => entry.date === todayKey);
  const [selectedEntryId, setSelectedEntryId] = useState<string>();
  const [showInteractive, setShowInteractive] = useState(false);
  const [candleMode, setCandleMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("candle-mode", candleMode);
    return () => document.documentElement.classList.remove("candle-mode");
  }, [candleMode]);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const entriesByDate = useMemo(
    () => new Map(entries.map((entry) => [entry.date, entry])),
    [entries]
  );
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);
  const firstWeekday = month.getDay();
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const handleSave = (responses: ExamenResponse[]) => {
    saveEntry({ date: todayKey, responses });
    setCandleMode(false);
  };

  return (
    <div className="app-background">
      <Header title="Examen" />

      <main className="max-w-3xl mx-auto px-5 lg:px-8 py-10 pb-24 lg:pb-12">
        <div className={candleMode ? "candle-muted-content" : undefined}>
          <div className="mb-2">
            <h1 className="text-editorial-5xl text-text mb-2">Daily Examen</h1>
            <p className="text-editorial-sm text-text-secondary">
              A gentle review of the day in the presence of God.
            </p>
          </div>

          <hr className="editorial-rule-thick my-6" />
        </div>
        {!showInteractive ? (
          <button
            type="button"
            onClick={() => setShowInteractive(true)}
            className={`card-editorial-padded w-full text-left transition-colors hover:border-text ${
              candleMode ? "candle-muted-content" : ""
            }`}
          >
            <p className="label-caps mb-2">Today&apos;s practice</p>
            <h2 className="text-editorial-3xl text-text mb-3">
              {todayEntry ? "Review today's Examen" : "Begin today's Examen"}
            </h2>
            <p className="text-editorial-sm text-text-secondary leading-relaxed">
              {todayEntry
                ? "Open the saved summary or review the prayerful steps again."
                : "Tap here when you are ready to pray through the five quiet steps."}
            </p>
            <p className="text-editorial-xs text-text-secondary mt-5">
              Open interactive Examen →
            </p>
          </button>
        ) : (
          <div>
            <DailyExamenTips
              initialResponses={todayEntry?.responses}
              onSave={handleSave}
              candleMode={candleMode}
              onToggleCandle={() => setCandleMode((current) => !current)}
            />
            <div className={candleMode ? "candle-muted-content" : undefined}>
              <button
                type="button"
                onClick={() => setShowInteractive(false)}
                className="mt-4 text-editorial-xs text-text-secondary hover:text-text"
              >
                Close interactive Examen
              </button>
            </div>
          </div>
        )}

        <div className={candleMode ? "candle-muted-content" : undefined}>
          <hr className="editorial-rule-thick my-10" />
        </div>

        <section
          aria-labelledby="examen-calendar-title"
          className={candleMode ? "candle-muted-content" : undefined}
        >
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="label-caps mb-2">Your practice</p>
              <h2 id="examen-calendar-title" className="text-editorial-3xl text-text">
                Examen calendar
              </h2>
            </div>
            <p className="text-editorial-xs text-text-secondary">
              {entries.length} saved day{entries.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="border border-border bg-paper p-5 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="p-2 text-text-secondary hover:text-text"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="text-editorial-2xl text-text">{formatMonth(month)}</h3>
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="p-2 text-text-secondary hover:text-text"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <span key={`${day}-${index}`} className="label-caps py-1">{day}</span>
              ))}
              {calendarCells.map((day, index) => {
                if (day === null) return <span key={`empty-${index}`} />;
                const dateKey = getLocalDateKey(
                  new Date(month.getFullYear(), month.getMonth(), day)
                );
                const entry = entriesByDate.get(dateKey);
                const isToday = dateKey === todayKey;
                return (
                  <button
                    key={dateKey}
                    type="button"
                    disabled={!entry}
                    onClick={() => entry && setSelectedEntryId(entry.id)}
                    aria-label={`${formatDate(dateKey)}${entry ? ", open saved Examen" : ""}`}
                    className={`relative flex h-10 items-center justify-center border text-editorial-sm transition-colors ${
                      entry
                        ? "bg-text text-bg border-text hover:opacity-80"
                        : "bg-transparent text-text-secondary border-transparent"
                    } ${isToday ? "ring-1 ring-text ring-offset-2 ring-offset-paper" : ""}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-editorial-xs text-text-secondary mt-3">
            Select a marked day to open its saved Examen. Archived entries remain in your calendar.
          </p>
        </section>
      </main>

      <ExamenEntryModal
        entry={selectedEntry}
        onClose={() => setSelectedEntryId(undefined)}
        onArchive={archiveEntry}
        onRestore={restoreEntry}
        onUpdate={updateEntry}
        onDelete={removeEntry}
      />
    </div>
  );
}
