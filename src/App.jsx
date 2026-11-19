import { useState } from "react";
import Header from "./components/Header.jsx";
import Toolbar from "./components/Toolbar.jsx";
import ProjectList from "./components/ProjectList.jsx";
import ProjectForm from "./components/ProjectForm.jsx";
import { defaultProjects } from "./data/projects.jsx";
import Modal from "./components/Modal.jsx";
import { defaultTasks } from "./data/tasks.jsx";

const taskStatuses = ["new", "in-progress", "done"];

export default function App() {
  const [projects, setProjects] = useState(defaultProjects);
  const [tasks, setTasks] = useState(defaultTasks);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visibleProjects = projects
    .filter((p) => status === "all" || p.status === status)
    .filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));
  function handleCreate(project) {
    setProjects([...projects, project]);
    setModalOpen(false)
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
        const nextStatus = taskStatuses[(currentIndex + 1) % taskStatuses.length];
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
        <ProjectList
          projects={visibleProjects}
          tasks={tasks}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onTaskStatusChange={handleTaskStatusChange}
        />
      </main>
    </div>
  );
}
