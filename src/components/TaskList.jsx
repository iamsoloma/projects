import TaskRow from "./TaskRow";

export default function TaskList({ tasks, onStatusChange }) {
  if (tasks.length === 0) {
    return <p>Задачи не добавлены</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
        />
      ))}
    </ul>
  );
}
