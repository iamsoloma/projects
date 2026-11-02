const totalTasks = projects.reduce((sum, p) => sum + p.tasksTotal, 0);
const doneTasks = projects.reduce((sum, p) => sum + p.tasksDone, 0);
const activeProjects = projects.filter((p) => p.status !== "done");

show("Проектов: " + projects.length
  + ", незавершённых: " + activeProjects.length
  + ", выполнено задач: " + doneTasks + " из " + totalTasks
  + " (" + getProgress(doneTasks, totalTasks) + "%)");


const byDeadline = [...projects].sort((a, b) => b.endDate.localeCompare(a.endDate));

let rows = "";
for (const p of byDeadline) {
  const taskCount = tasks.filter(t => t.projectId === p.id).length;
  rows += "<tr>"
    + "<td>" + p.title + " <small>(задач: " + taskCount + ")</small></td>"
    + "<td>" + p.client + "</td>"
    + "<td>" + statusBadge(p.status) + "</td>"
    + "<td>" + formatDate(p.endDate) + "</td>"
    + "<td>" + progressBar(p.tasksDone, p.tasksTotal) + "</td>"
    + "</tr>";
}

document.querySelector("#projects-body").innerHTML = rows;


const query = "Портал";
const found = projects.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
show("Найдено по запросу «" + query + "»: " + found.map(p => p.title).join(", "));