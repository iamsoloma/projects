import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Toolbar from "./components/Toolbar.jsx";
import ProjectList from "./components/ProjectList.jsx";
import ProjectForm from "./components/ProjectForm.jsx";
import Modal from "./components/Modal.jsx";

const taskStatuses = ["new", "in-progress", "done"];

export default function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("pms.projects");
    return saved ? JSON.parse(saved) : [];
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("pms.tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/data/projects.json");
        if (!response.ok) {
          throw new Error(`Сервер вернул статус ${response.status}`);
        }
        const data = await response.json();
        const saved = localStorage.getItem("pms.projects");
        setProjects(saved ? JSON.parse(saved) : data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/data/tasks.json");
        if (!response.ok) {
          throw new Error(`Сервер вернул статус ${response.status}`);
        }
        const data = await response.json();
        const saved = localStorage.getItem("pms.tasks");
        setTasks(saved ? JSON.parse(saved) : data);
      } catch (err) {
        setTasksError(err.message);
      } finally {
        setTasksLoading(false);
      }
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    if (isLoading) return; // не записывать пустой массив до конца загрузки
    localStorage.setItem("pms.projects", JSON.stringify(projects));
  }, [projects, isLoading]);

  useEffect(() => {
    if (isTasksLoading) return;
    localStorage.setItem("pms.tasks", JSON.stringify(tasks));
  }, [tasks, isTasksLoading]);

  const visibleProjects = projects
    .filter((p) => status === "all" || p.status === status)
    .filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));
  function handleCreate(project) {
    setProjects([...projects, project]);
    setModalOpen(false);
  }
  function handleDelete(id) {
    setProjects(projects.filter((p) => p.id !== id));
  }
  function handleStatusChange(id, status) {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)));
  }
  function handleTaskStatusChange(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) return task;
        const currentIndex = taskStatuses.indexOf(task.status);
        const nextStatus =
          taskStatuses[(currentIndex + 1) % taskStatuses.length];
        return { ...task, status: nextStatus };
      }),
    );
  }
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div className="app">
      <Header />
      <main className="content">
        <button onClick={() => setModalOpen(true)}>Создать проект</button>
        {isModalOpen && (
          <Modal title="Новый проект" onClose={() => setModalOpen(false)}>
            <ProjectForm onCreate={handleCreate} />
          </Modal>
        )}
        <h2>
          Проекты ({visibleProjects.length} из {projects.length})
        </h2>
        <Toolbar
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
        />
        {isLoading && <p className="loading">Загрузка проектов...</p>}
        {error && (
          <p className="error">
            Не удалось загрузить данные. Обновите страницу.
          </p>
        )}
        {isTasksLoading && !isLoading && <p className="loading">Загрузка задач...</p>}
        {tasksError && (
          <p className="error">
            Не удалось загрузить задачи. Обновите страницу.
          </p>
        )}
        {!isLoading && !error && visibleProjects.length === 0 && (
          <p className="empty">
            Проекты не найдены. Измените условия отбора.
          </p>
        )}
        {!isLoading && !error && visibleProjects.length > 0 && (
          <ProjectList
            projects={visibleProjects}
            tasks={tasks}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onTaskStatusChange={handleTaskStatusChange}
          />
        )}
      </main>
    </div>
  );
}
