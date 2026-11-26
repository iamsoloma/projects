import TaskList from "../components/TaskList.jsx";

export default function TasksPage({
  tasks,
  projects,
  isTasksLoading,
  tasksError,
  onTaskStatusChange,
  onTaskDelete,
}) {
  return (
    <section>
      <h2>Мои задачи ({tasks.length})</h2>
      {isTasksLoading && <p className="loading">Загрузка задач...</p>}
      {tasksError && (
        <p className="error">
          Не удалось загрузить задачи: {tasksError}. Обновите страницу.
        </p>
      )}
      {!isTasksLoading && !tasksError && tasks.length === 0 && (
        <p className="empty">Задачи не найдены.</p>
      )}
      {!isTasksLoading && !tasksError && tasks.length > 0 && (
        <TaskList
          tasks={tasks}
          projects={projects}
          onStatusChange={onTaskStatusChange}
          onDelete={onTaskDelete}
        />
      )}
    </section>
  );
}
