import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({
  project,
  onStatusChange,
  onDelete,
}) {
  return (
    <article className="project-card">
      <Link
        to={`/projects/${project.id}`}
        className="project-card__link"
      >
        <h3 className="project-card__title">{project.title}</h3>
      </Link>
      <p className="project-card__client">{project.client}</p>
      <p className="project-card__manager">Руководитель: {project.manager}</p>
      <p className="project-card__deadline">Срок: {formatDate(project.endDate)}</p>
      <ProgressBar done={project.tasksDone} total={project.tasksTotal} />
      <StatusBadge status={project.status} />
      <div className="project-card__actions">
        <button onClick={() => onStatusChange(project.id, "done")}>
          Завершить
        </button>
        <button className="btn-danger" onClick={() => onDelete(project.id)}>
          Удалить
        </button>
      </div>
    </article>
  );
}
