import { Link, useParams } from "react-router-dom";
import { formatDate } from "../utils/format";
import StatusBadge from "../components/StatusBadge.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import TaskList from "../components/TaskList.jsx";

export default function ProjectPage({
  projects,
  tasks,
  onTaskStatusChange,
  onTaskDelete,
}) {
  const { id } = useParams();
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div>
        <p className="empty">Проект не найден.</p>
        <Link to="/">Вернуться к списку проектов</Link>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  return (
    <article className="project-page">
      <Link to="/" className="back-link">← К списку проектов</Link>
      <h2>{project.title}</h2>
      <p>Заказчик: {project.client}</p>
      <p>Руководитель: {project.manager}</p>
      <p>Дата начала: {formatDate(project.startDate)}</p>
      <p>Срок завершения: {formatDate(project.endDate)}</p>
      <StatusBadge status={project.status} />
      <ProgressBar done={project.tasksDone} total={project.tasksTotal} />
      <h3>Задачи проекта ({projectTasks.length})</h3>
      <TaskList
        tasks={projectTasks}
        onStatusChange={onTaskStatusChange}
        onDelete={onTaskDelete}
      />
    </article>
  );
}
