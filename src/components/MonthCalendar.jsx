import {
  getCalendarGrid,
  getDaysLeftTooltip,
  getWeekDaysRu,
  getMonthTitle,
  getTodayISOInBeijing,
  toISODate
} from "../lib/date";

const WEEKDAY_NAMES_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function planRowText(plan) {
  return `${plan.subject}: ${plan.title}`;
}

function getCellTitle(dateKey) {
  return `${dateKey} • ${getDaysLeftTooltip(dateKey)} (по Пекину)`;
}

function getWeeklyCellTitle(dateKey, weekdayName, classesCount) {
  const lessonLabel = classesCount === 1 ? "class" : "classes";
  return `${dateKey} • ${weekdayName} • ${classesCount} ${lessonLabel}`;
}

function getWeekdayNameEn(dateObj) {
  return WEEKDAY_NAMES_EN[dateObj.getDay()];
}

function weeklyClassRowText(weeklyClass) {
  return `${weeklyClass.subjectShort} ${weeklyClass.title} ${weeklyClass.startTime}-${weeklyClass.endTime}`;
}

function handlePlanClick(event, plan, onPlanCtrlClick) {
  if (!event.ctrlKey || typeof onPlanCtrlClick !== "function") {
    return;
  }

  event.preventDefault();
  onPlanCtrlClick(plan);
}

function hexToRgba(hexColor, alpha) {
  const raw = hexColor.replace("#", "");
  const normalized =
    raw.length === 3 ? raw.split("").map((char) => char + char).join("") : raw;

  if (normalized.length !== 6) {
    return `rgba(100, 116, 139, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function MonthCalendar({
  year,
  monthIndex,
  plans,
  mode = "final",
  weeklyScheduleByWeekday = {},
  onPlanCtrlClick
}) {
  const days = getCalendarGrid(year, monthIndex);
  const weekDays = getWeekDaysRu();
  const todayIso = getTodayISOInBeijing();

  const plansByDate = plans.reduce((acc, plan) => {
    if (!acc[plan.date]) {
      acc[plan.date] = [];
    }
    acc[plan.date].push(plan);
    return acc;
  }, {});

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold capitalize text-slate-900">
        {getMonthTitle(year, monthIndex)}
      </h2>

      <div className="grid grid-cols-7 border border-border">
        {weekDays.map((dayName) => (
          <div
            key={dayName}
            className="border-b border-r border-border bg-slate-200 px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700 last:border-r-0"
          >
            {dayName}
          </div>
        ))}

        {days.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-28 border-b border-r border-border bg-white p-2 last:border-r-0"
              />
            );
          }

          const dateKey = toISODate(day);
          const isToday = dateKey === todayIso;
          const dayPlans = plansByDate[dateKey] ?? [];
          const weekdayName = getWeekdayNameEn(day);
          const dayWeeklyClasses = weeklyScheduleByWeekday?.[weekdayName] ?? [];
          const isWeeklyMode = mode === "weekly";
          const cellTitle = isWeeklyMode
            ? getWeeklyCellTitle(dateKey, weekdayName, dayWeeklyClasses.length)
            : getCellTitle(dateKey);

          return (
            <div
              key={dateKey}
              className="min-h-28 border-b border-r border-border bg-white p-2 hover:bg-slate-50/70 last:border-r-0"
              title={cellTitle}
            >
              <p className="mb-2">
                <span
                  className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                    isToday
                      ? "border border-red-500 bg-white text-slate-800"
                      : "text-slate-700"
                  }`}
                >
                  {day.getDate()}
                </span>
              </p>
              <ul className="space-y-1">
                {isWeeklyMode
                  ? dayWeeklyClasses.map((weeklyClass) => (
                      <li
                        key={weeklyClass.id}
                        className="rounded border px-1.5 py-1 text-xs leading-4 text-slate-800 whitespace-normal break-words"
                        style={{
                          borderColor: weeklyClass.subjectColor,
                          backgroundColor: hexToRgba(weeklyClass.subjectColor, 0.16)
                        }}
                        title={`${weeklyClassRowText(weeklyClass)} • ${
                          weeklyClass.locationText
                        }`}
                      >
                        <span className="font-semibold text-slate-900">
                          {weeklyClass.startTime}-{weeklyClass.endTime}
                        </span>
                        <span className="text-slate-700"> {weeklyClass.subjectShort}: </span>
                        <span className="text-slate-900">{weeklyClass.title}</span>
                      </li>
                    ))
                  : dayPlans.map((plan) => (
                      <li
                        key={plan.id}
                        className="rounded border px-1.5 py-1 text-xs leading-4 text-slate-800 whitespace-normal break-words"
                        style={{
                          borderColor: plan.subjectColor,
                          backgroundColor: hexToRgba(plan.subjectColor, 0.16)
                        }}
                        title={`${planRowText(plan)} • ${getDaysLeftTooltip(
                          plan.date
                        )} (по Пекину) • Ctrl + ЛКМ: изменить план`}
                        onClick={(event) => handlePlanClick(event, plan, onPlanCtrlClick)}
                      >
                        <span className="text-slate-700">{plan.subject}: </span>
                        <span className="font-semibold text-slate-900">{plan.title}</span>
                      </li>
                    ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
