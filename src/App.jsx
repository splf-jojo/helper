import { useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import PlanEditModal from "./components/PlanEditModal";
import Sidebar from "./components/Sidebar";
import { parseISODate } from "./lib/date";
import { getPlans, getSubjectById, getSubjects } from "./lib/data";
import AllSubjectsPage from "./pages/AllSubjectsPage";
import HomePage from "./pages/HomePage";
import SubjectPage from "./pages/SubjectPage";

function sortPlansByDateAsc(a, b) {
  return parseISODate(a.date) - parseISODate(b.date);
}

function SubjectRoute({ plans }) {
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId ?? "");
  const subjectPlans = plans.filter((plan) => plan.subjectId === (subjectId ?? ""));
  return <SubjectPage subject={subject} plans={subjectPlans} />;
}

export default function App() {
  const subjects = getSubjects();
  const [plans, setPlans] = useState(() => getPlans());
  const [editingPlanId, setEditingPlanId] = useState(null);

  const editingPlan = plans.find((plan) => plan.id === editingPlanId) ?? null;

  function handleOpenPlanEditor(plan) {
    setEditingPlanId(plan.id);
  }

  function handleClosePlanEditor() {
    setEditingPlanId(null);
  }

  function handleSavePlan(updatedPlanValues) {
    if (!editingPlanId) {
      return;
    }

    setPlans((prevPlans) =>
      prevPlans
        .map((plan) =>
          plan.id === editingPlanId ? { ...plan, ...updatedPlanValues } : plan
        )
        .sort(sortPlansByDateAsc)
    );
    setEditingPlanId(null);
  }

  return (
    <div className="min-h-full md:flex">
      <Sidebar subjects={subjects} />
      <div className="flex-1 p-4 md:p-6">
        <Routes>
          <Route
            path="/"
            element={<HomePage plans={plans} onPlanCtrlClick={handleOpenPlanEditor} />}
          />
          <Route path="/subjects" element={<AllSubjectsPage plans={plans} />} />
          <Route path="/subjects/:subjectId" element={<SubjectRoute plans={plans} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <PlanEditModal
        plan={editingPlan}
        isOpen={Boolean(editingPlan)}
        onClose={handleClosePlanEditor}
        onSave={handleSavePlan}
      />
    </div>
  );
}
