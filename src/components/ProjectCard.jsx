import { formatDate } from "../utils/format";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./statusBadge";
import TaskList from "./TaskList";

export default function ProjectCard({
  project,
  tasks,
  onStatusChange,
  onDelete,
  onTaskStatusChange,
}) {
  return (
    <article className="project-card">
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__client">{project.client}</p>
      <p className="project-card__manager">Руководитель: {project.manager}</p>
      <p className="project-card__deadline">
        <div className="project-card__actions">
          <button onClick={() => onStatusChange(project.id, "done")}>
            Завершить
          </button>
          <button className="btn-danger" onClick={() => onDelete(project.id)}>
            Удалить
          </button>
        </div>
        Срок: {formatDate(project.endDate)}
      </p>
      <ProgressBar done={project.tasksDone} total={project.tasksTotal} />
      <StatusBadge status={project.status} />
      <TaskList tasks={tasks} onStatusChange={onTaskStatusChange} />
    </article>
  );
}
