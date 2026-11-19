import { formatDate } from "../utils/format";
import StatusBadge from "./statusBadge";

export default function TaskRow({ task, onStatusChange }) {
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
      <span>Исполнитель: {task.assignee}</span>
      <time dateTime={task.deadline}>Срок: {formatDate(task.deadline)}</time>
      <StatusBadge status={task.status} />
      <button type="button" onClick={() => onStatusChange(task.id)}>
        Следующий статус
      </button>
    </li>
  );
}
