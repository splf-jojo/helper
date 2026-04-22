import rawData from "../../data.json";
import rawSchedule from "../../schedule.json";
import { parseISODate } from "./date";

function sortByDateAsc(a, b) {
  return parseISODate(a.date) - parseISODate(b.date);
}

const subjectById = rawData.subjects.reduce((acc, subject) => {
  acc[subject.id] = subject;
  return acc;
}, {});

const subjectByCode = rawData.subjects.reduce((acc, subject) => {
  acc[subject.name] = subject;
  return acc;
}, {});

function sortScheduleByTimeAsc(a, b) {
  return a.startTime.localeCompare(b.startTime);
}

function formatScheduleLocation(location) {
  if (Array.isArray(location)) {
    return location.join(" / ");
  }

  return location ?? "";
}

export function getSubjects() {
  return [...rawData.subjects].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPlans() {
  return [...rawData.plans]
    .map((plan) => ({
      ...plan,
      subject:
        subjectById[plan.subjectId]?.subject ?? subjectById[plan.subjectId]?.name ?? "",
      subjectColor: subjectById[plan.subjectId]?.color ?? "#64748b"
    }))
    .sort(sortByDateAsc);
}

export function getSubjectById(subjectId) {
  return rawData.subjects.find((subject) => subject.id === subjectId);
}

export function getPlansBySubject(subjectId) {
  return getPlans().filter((plan) => plan.subjectId === subjectId);
}

export function getWeeklyScheduleByWeekday() {
  return Object.entries(rawSchedule.weeklySchedule).reduce((acc, [weekday, classes]) => {
    acc[weekday] = [...classes]
      .map((scheduleItem, index) => {
        const subject = subjectByCode[scheduleItem.courseCode];

        return {
          ...scheduleItem,
          id: `${weekday}-${scheduleItem.courseCode}-${scheduleItem.section}-${scheduleItem.startTime}-${index}`,
          subject: subject?.subject ?? scheduleItem.courseCode,
          subjectShort: subject?.name ?? scheduleItem.courseCode,
          subjectColor: subject?.color ?? "#64748b",
          locationText: formatScheduleLocation(scheduleItem.location)
        };
      })
      .sort(sortScheduleByTimeAsc);

    return acc;
  }, {});
}

export function getWeeklyScheduleSource() {
  return rawSchedule.weeklySchedule;
}
