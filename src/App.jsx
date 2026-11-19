import { useState } from "react";
import Header from "./components/Header.jsx";
import ProjectList from "./components/ProjectList.jsx";
import { defaultProjects } from "./data/projects.jsx";
import Toolbar from "./components/ToolBar.jsx";

export default function App() {
  const [projects] = useState(defaultProjects)
    const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visibleProjects = projects.filter(p=>status==="all" || p.status === status).filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="app">
      <Header />
      <main className="content">
        <h2>Проекты ({visibleProjects.length}) из ({projects.length})</h2>
        <Toolbar query={query} status={status} onQueryChange={setQuery} onStatusChange={setStatus}/>
        <ProjectList projects={visibleProjects} />
      </main>
    </div>
  );
}
