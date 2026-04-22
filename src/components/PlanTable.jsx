import { formatDateRu } from "../lib/date";

const TYPE_LABELS = {
  quiz: "Quiz",
  midterm: "Midterm",
  final: "Final",
  exam: "Exam",
  presentation: "Presentation",
  deadline: "Deadline",
  other: "Other"
};

export default function PlanTable({ plans, showSubjectColumn = true }) {
  if (plans.length === 0) {
    return (
      <div className="rounded-md border border-border px-4 py-8 text-center text-sm text-muted">
        Планов не найдено.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-white">
      <table className="min-w-full table-fixed border-collapse text-sm">
        <thead className="bg-slate-200">
          <tr>
            <th className="w-32 border-b border-border px-3 py-2 text-left font-semibold text-slate-700">
              Дата
            </th>
            {showSubjectColumn && (
              <th className="w-72 border-b border-border px-3 py-2 text-left font-semibold text-slate-700">
                Предмет
              </th>
            )}
            <th className="w-48 border-b border-border px-3 py-2 text-left font-semibold text-slate-700">
              План
            </th>
            <th className="w-32 border-b border-border px-3 py-2 text-left font-semibold text-slate-700">
              Тип
            </th>
            <th className="border-b border-border px-3 py-2 text-left font-semibold text-slate-700">
              Примечание
            </th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, index) => (
            <tr
              key={plan.id}
              className={`align-top ${index % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
            >
              <td className="border-b border-border px-3 py-2 text-slate-700">
                {formatDateRu(plan.date)}
              </td>
              {showSubjectColumn && (
                <td className="border-b border-border px-3 py-2 text-slate-700">
                  {plan.subject}
                </td>
              )}
              <td className="border-b border-border px-3 py-2 font-medium text-slate-900">
                {plan.title}
              </td>
              <td className="border-b border-border px-3 py-2 text-slate-700">
                {TYPE_LABELS[plan.type] ?? plan.type}
              </td>
              <td className="border-b border-border px-3 py-2 text-slate-700">
                {plan.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
