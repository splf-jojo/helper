import { NavLink } from "react-router-dom";

function getLinkClass({ isActive }) {
  const baseClass =
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const activeClass = "bg-slate-900 text-white";
  const inactiveClass = "text-slate-700 hover:bg-slate-100";
  return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
}

export default function Sidebar({ subjects }) {
  return (
    <aside className="w-full border-b border-border bg-white p-4 md:w-72 md:border-b-0 md:border-r md:p-5">
      <div className="mb-6">
        <h1 className="text-lg font-semibold">Планер месяца</h1>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" className={getLinkClass} end>
          Главная
        </NavLink>
        <NavLink to="/ai-planner" className={getLinkClass} end>
          AI Planner
        </NavLink>
        <NavLink to="/subjects" className={getLinkClass} end>
          Все предметы
        </NavLink>
      </nav>

      <div className="mt-6 border-t border-border pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Предметы
        </p>
        <nav className="space-y-2">
          {subjects.map((subject) => (
            <NavLink
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className={getLinkClass}
            >
              {subject.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
