import TaskRow from "./TaskRow";

export default function TaskList({
  tasks,
  onStatusChange,
  onDelete,
  projects,
}) {
  if (tasks.length === 0) {
    return <p className="empty">Задачи не добавлены.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const project = projects
          ? projects.find((p) => p.id === task.projectId)
          : null;
        return (
          <TaskRow
            key={task.id}
            task={task}
            projectTitle={project ? project.title : null}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  );
}
