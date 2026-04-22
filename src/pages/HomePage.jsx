import MonthCalendar from "../components/MonthCalendar";
import { getCurrentMonthInfo, isSameMonth } from "../lib/date";

export default function HomePage({ plans, onPlanCtrlClick }) {
  const { year, monthIndex } = getCurrentMonthInfo();
  const monthPlans = plans.filter((plan) => isSameMonth(plan.date, year, monthIndex));
  const secondMonthPlans = plans.filter((plan) =>
    isSameMonth(plan.date, year, monthIndex + 1)
  );

  return (
    <main className="space-y-4">
      <MonthCalendar
        year={year}
        monthIndex={monthIndex}
        plans={monthPlans}
        onPlanCtrlClick={onPlanCtrlClick}
      />
      <MonthCalendar
        year={year}
        monthIndex={monthIndex + 1}
        plans={secondMonthPlans}
        onPlanCtrlClick={onPlanCtrlClick}
      />
    </main>
  );
}
