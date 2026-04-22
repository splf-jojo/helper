import PlanTable from "../components/PlanTable";

export default function AllSubjectsPage({ plans }) {
  return (
    <main className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Все предметы</h2>
        <p className="text-sm text-muted">Общая таблица всех планов.</p>
      </div>

      <PlanTable plans={plans} />
    </main>
  );
}
