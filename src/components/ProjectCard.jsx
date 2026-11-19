import { formatDate } from "../utils/format";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./statusBadge";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__client">{project.client}</p>
      <p className="project-card__manager">Руководитель: {project.manager}</p>
      <p className="project-card__deadline">
        Срок: {formatDate(project.endDate)}
      </p>
      <ProgressBar done={project.tasksDone} total={project.tasksTotal} />
      <StatusBadge status={project.status} />
    </article>
  );
}
