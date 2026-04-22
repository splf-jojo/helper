const WEEK_DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const BEIJING_TIME_ZONE = "Asia/Shanghai";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const BEIJING_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: BEIJING_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

function normalizeMonth(year, monthIndex) {
  const normalizedDate = new Date(year, monthIndex, 1);
  return {
    year: normalizedDate.getFullYear(),
    monthIndex: normalizedDate.getMonth()
  };
}

function getDatePartsInTimeZone(dateObj) {
  const dateParts = BEIJING_DATE_FORMATTER.formatToParts(dateObj).reduce((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return {
    year: Number(dateParts.year),
    monthIndex: Number(dateParts.month) - 1,
    day: Number(dateParts.day)
  };
}

function getUtcTimestampFromIso(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function formatDayWord(daysCount) {
  const absDays = Math.abs(daysCount);
  const lastDigit = absDays % 10;
  const lastTwoDigits = absDays % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "дней";
  }

  if (lastDigit === 1) {
    return "день";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "дня";
  }

  return "дней";
}

export function parseISODate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateRu(isoDate) {
  return parseISODate(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export function getCurrentMonthInfo() {
  const now = getDatePartsInTimeZone(new Date());
  return {
    year: now.year,
    monthIndex: now.monthIndex
  };
}

export function getMonthTitle(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric"
  });
}

export function getWeekDaysRu() {
  return WEEK_DAYS_RU;
}

export function getCalendarGrid(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayJs = new Date(year, monthIndex, 1).getDay();
  const firstDayMondayBased = firstDayJs === 0 ? 6 : firstDayJs - 1;

  const cells = [];

  for (let i = 0; i < firstDayMondayBased; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function isSameMonth(dateValue, year, monthIndex) {
  const normalizedMonth = normalizeMonth(year, monthIndex);
  const d = typeof dateValue === "string" ? parseISODate(dateValue) : dateValue;
  return (
    d.getFullYear() === normalizedMonth.year &&
    d.getMonth() === normalizedMonth.monthIndex
  );
}

export function toISODate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayISOInBeijing() {
  const { year, monthIndex, day } = getDatePartsInTimeZone(new Date());
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getDaysFromBeijingToday(isoDate) {
  const todayUtcTimestamp = getUtcTimestampFromIso(getTodayISOInBeijing());
  const targetUtcTimestamp = getUtcTimestampFromIso(isoDate);
  return Math.round((targetUtcTimestamp - todayUtcTimestamp) / DAY_IN_MS);
}

export function getDaysLeftTooltip(isoDate) {
  const dayDiff = getDaysFromBeijingToday(isoDate);

  if (dayDiff === 0) {
    return "Сегодня";
  }

  if (dayDiff > 0) {
    return `Осталось ${dayDiff} ${formatDayWord(dayDiff)}`;
  }

  const overdueDays = Math.abs(dayDiff);
  return `Прошло ${overdueDays} ${formatDayWord(overdueDays)}`;
}
