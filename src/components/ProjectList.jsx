import ProjectCard from "./ProjectCard";

export default function ProjectList({
  projects,
  onStatusChange,
  onDelete,
}) {
  if (projects.length === 0) {
    return (
      <p className="empty">Проекты не найдены. Измените условия отбора.</p>
    );
  }

  return (
    <section className="project-list">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
