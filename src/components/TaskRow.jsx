import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";
import StatusBadge from "./StatusBadge";

export default function TaskRow({
  task,
  projectTitle,
  onStatusChange,
  onDelete,
}) {
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const isOverdue = task.status !== "done" && task.deadline < todayString;

  return (
    <li className={`task-row${isOverdue ? " task--overdue" : ""}`}>
      <span className="task-row__title">{task.title}</span>
      {projectTitle && (
        <Link to={`/projects/${task.projectId}`} className="task-row__project">
          {projectTitle}
        </Link>
      )}
      <span>Исполнитель: {task.assignee}</span>
      <time dateTime={task.deadline}>Срок: {formatDate(task.deadline)}</time>
      <StatusBadge status={task.status} />
      <button type="button" onClick={() => onStatusChange(task.id)}>
        Следующий статус
      </button>
      <button
        type="button"
        className="btn-danger"
        onClick={() => onDelete(task.id)}
      >
        Удалить
      </button>
    </li>
  );
}
