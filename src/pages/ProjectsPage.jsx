import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar.jsx";
import ProjectList from "../components/ProjectList.jsx";
import ProjectForm from "../components/ProjectForm.jsx";
import Modal from "../components/Modal.jsx";

export default function ProjectsPage({
  projects,
  visibleProjects,
  isLoading,
  error,
  query,
  status,
  onQueryChange,
  onStatusChange,
  onCreate,
  onDelete,
  onProjectStatusChange,
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleCreate(project) {
    onCreate(project);
    setModalOpen(false);
    navigate(`/projects/${project.id}`);
  }

  return (
    <section>
      <h2>Проекты ({visibleProjects.length} из {projects.length})</h2>
      <Toolbar
        query={query}
        status={status}
        onQueryChange={onQueryChange}
        onStatusChange={onStatusChange}
      />
      {isLoading && <p className="loading">Загрузка проектов...</p>}
      {error && (
        <p className="error">
          Не удалось загрузить данные: {error}. Обновите страницу.
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
          onStatusChange={onProjectStatusChange}
          onDelete={onDelete}
        />
      )}
      <button className="btn" onClick={() => setModalOpen(true)}>
        Создать проект
      </button>
      {isModalOpen && (
        <Modal title="Новый проект" onClose={() => setModalOpen(false)}>
          <ProjectForm onCreate={handleCreate} />
        </Modal>
      )}
    </section>
  );
}
