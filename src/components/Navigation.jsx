import { NavLink } from "react-router-dom";

export default function Navigation() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  return (
    <nav className="navigation">
      <NavLink to="/" end className={linkClass}>
        Проекты
      </NavLink>
      <NavLink to="/tasks" className={linkClass}>
        Мои задачи
      </NavLink>
      <NavLink to="/reports" className={linkClass}>
        Отчёты
      </NavLink>
    </nav>
  );
}
