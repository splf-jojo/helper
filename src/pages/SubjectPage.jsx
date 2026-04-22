import PlanTable from "../components/PlanTable";

export default function SubjectPage({ subject, plans }) {
  if (!subject) {
    return (
      <main>
        <h2 className="text-2xl font-semibold text-slate-900">Предмет не найден</h2>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{subject.name}</h2>
        <p className="text-sm text-muted">Таблица планов по выбранному предмету.</p>
      </div>

      <PlanTable plans={plans} showSubjectColumn={false} />
    </main>
  );
}
