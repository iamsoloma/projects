import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Navigation from "./components/Navigation.jsx";
import Footer from "./components/Footer.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

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

  // Состояния отбора размещены выше маршрутов: при возврате по кнопке
  // «Назад» браузера введённые условия поиска и фильтрации сохраняются.
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

  // Пересчёт индикатора готовности проектов по текущему списку задач
  function recalcProgress(currentProjects, currentTasks) {
    return currentProjects.map((project) => {
      const projectTasks = currentTasks.filter(
        (t) => t.projectId === project.id,
      );
      return {
        ...project,
        tasksTotal: projectTasks.length,
        tasksDone: projectTasks.filter((t) => t.status === "done").length,
      };
    });
  }

  function handleCreate(project) {
    setProjects((current) => [...current, project]);
  }

  function handleDelete(id) {
    setProjects(projects.filter((p) => p.id !== id));
  }

  function handleProjectStatusChange(id, nextStatus) {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)),
    );
  }

  function handleTaskStatusChange(id) {
    const nextTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      const currentIndex = taskStatuses.indexOf(task.status);
      const nextStatus =
        taskStatuses[(currentIndex + 1) % taskStatuses.length];
      return { ...task, status: nextStatus };
    });
    setTasks(nextTasks);
    setProjects(recalcProgress(projects, nextTasks));
  }

  function handleTaskDelete(id) {
    const nextTasks = tasks.filter((task) => task.id !== id);
    setTasks(nextTasks);
    setProjects(recalcProgress(projects, nextTasks));
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Navigation />
        <main className="content">
          <Routes>
            <Route
              path="/"
              element={
                <ProjectsPage
                  projects={projects}
                  visibleProjects={visibleProjects}
                  isLoading={isLoading}
                  error={error}
                  query={query}
                  status={status}
                  onQueryChange={setQuery}
                  onStatusChange={setStatus}
                  onCreate={handleCreate}
                  onDelete={handleDelete}
                  onProjectStatusChange={handleProjectStatusChange}
                />
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProjectPage
                  projects={projects}
                  tasks={tasks}
                  onTaskStatusChange={handleTaskStatusChange}
                  onTaskDelete={handleTaskDelete}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  tasks={tasks}
                  projects={projects}
                  isTasksLoading={isTasksLoading}
                  tasksError={tasksError}
                  onTaskStatusChange={handleTaskStatusChange}
                  onTaskDelete={handleTaskDelete}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
