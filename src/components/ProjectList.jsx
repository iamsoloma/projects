import ProjectCard from "./ProjectCard";

export default function ProjectList({
  projects,
  tasks,
  onStatusChange,
  onDelete,
  onTaskStatusChange,
}) {
  if (projects.lenght === 0) {
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
          tasks={tasks.filter((task) => task.projectId === project.id)}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onTaskStatusChange={onTaskStatusChange}
        />
      ))}
    </section>
  );
}
