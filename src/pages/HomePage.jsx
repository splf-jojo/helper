import { useMemo, useState } from "react";
import MonthCalendar from "../components/MonthCalendar";
import { getCurrentMonthInfo, isSameMonth } from "../lib/date";
import { getWeeklyScheduleByWeekday } from "../lib/data";

const CALENDAR_MODES = {
  final: "final",
  weekly: "weekly"
};

function CalendarModeToggle({ mode, onChange }) {
  return (
    <div className="inline-flex rounded-md border border-border bg-white p-1">
      <button
        type="button"
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          mode === CALENDAR_MODES.final
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
        onClick={() => onChange(CALENDAR_MODES.final)}
      >
        Final test schedule
      </button>
      <button
        type="button"
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          mode === CALENDAR_MODES.weekly
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
        onClick={() => onChange(CALENDAR_MODES.weekly)}
      >
        Weekly schedule
      </button>
    </div>
  );
}

export default function HomePage({ plans, onPlanCtrlClick }) {
  const [calendarMode, setCalendarMode] = useState(CALENDAR_MODES.final);
  const { year, monthIndex } = getCurrentMonthInfo();
  const monthPlans = plans.filter((plan) => isSameMonth(plan.date, year, monthIndex));
  const secondMonthPlans = plans.filter((plan) =>
    isSameMonth(plan.date, year, monthIndex + 1)
  );
  const weeklyScheduleByWeekday = useMemo(() => getWeeklyScheduleByWeekday(), []);

  return (
    <main className="space-y-4">
      <CalendarModeToggle mode={calendarMode} onChange={setCalendarMode} />
      <MonthCalendar
        year={year}
        monthIndex={monthIndex}
        plans={monthPlans}
        mode={calendarMode}
        weeklyScheduleByWeekday={weeklyScheduleByWeekday}
        onPlanCtrlClick={onPlanCtrlClick}
      />
      <MonthCalendar
        year={year}
        monthIndex={monthIndex + 1}
        plans={secondMonthPlans}
        mode={calendarMode}
        weeklyScheduleByWeekday={weeklyScheduleByWeekday}
        onPlanCtrlClick={onPlanCtrlClick}
      />
    </main>
  );
}
