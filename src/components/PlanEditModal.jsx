import { useEffect, useState } from "react";

const TYPE_OPTIONS = ["quiz", "midterm", "final", "exam", "presentation", "deadline", "other"];

const TYPE_LABELS = {
  quiz: "Quiz",
  midterm: "Midterm",
  final: "Final",
  exam: "Exam",
  presentation: "Presentation",
  deadline: "Deadline",
  other: "Other"
};

const EMPTY_DRAFT = {
  date: "",
  title: "",
  type: "other",
  notes: ""
};

function createDraftFromPlan(plan) {
  if (!plan) {
    return EMPTY_DRAFT;
  }

  return {
    date: plan.date ?? "",
    title: plan.title ?? "",
    type: plan.type ?? "other",
    notes: plan.notes ?? ""
  };
}

export default function PlanEditModal({ plan, isOpen, onClose, onSave }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraft(createDraftFromPlan(plan));
  }, [isOpen, plan]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !plan) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(draft);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Изменение плана"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Изменение плана</h2>
          <p className="text-xs text-muted">Предмет: {plan.subject}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 px-5 py-4">
            <label className="space-y-1 text-sm text-slate-700">
              <span>Дата</span>
              <input
                type="date"
                name="date"
                value={draft.date}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                required
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Название</span>
              <input
                type="text"
                name="title"
                value={draft.title}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                required
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Тип</span>
              <select
                name="type"
                value={draft.type}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              >
                {TYPE_OPTIONS.map((typeOption) => (
                  <option key={typeOption} value={typeOption}>
                    {TYPE_LABELS[typeOption] ?? typeOption}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Примечание</span>
              <textarea
                name="notes"
                value={draft.notes}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
