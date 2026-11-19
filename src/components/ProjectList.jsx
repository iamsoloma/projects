import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects }) {
  if (projects.lenght === 0) {
    return (
      <p className="empty">Проекты не найдены. Измените условия отбора.</p>
    );
  }

  return (
    <section className="project-list">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
