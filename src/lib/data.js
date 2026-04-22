import rawData from "../../data.json";
import { parseISODate } from "./date";

function sortByDateAsc(a, b) {
  return parseISODate(a.date) - parseISODate(b.date);
}

const subjectById = rawData.subjects.reduce((acc, subject) => {
  acc[subject.id] = subject;
  return acc;
}, {});

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
