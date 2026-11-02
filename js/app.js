const totalTasks = projects.reduce((sum, p) => sum + p.tasksTotal, 0);
const doneTasks = projects.reduce((sum, p) => sum + p.tasksDone, 0);
const activeProjects = projects.filter((p) => p.status !== "done");

show(
  "Проектов: " +
    projects.length +
    ", незавершённых: " +
    activeProjects.length +
    ", выполнено задач: " +
    doneTasks +
    " из " +
    totalTasks +
    " (" +
    getProgress(doneTasks, totalTasks) +
    "%)",
);

const byDeadline = [...projects].sort((a, b) =>
  b.endDate.localeCompare(a.endDate),
);

let rows = "";
for (const p of byDeadline) {
  const taskCount = tasks.filter((t) => t.projectId === p.id).length;
  rows +=
    "<tr>" +
    "<td>" +
    p.title +
    " <small>(задач: " +
    taskCount +
    ")</small></td>" +
    "<td>" +
    p.client +
    "</td>" +
    "<td>" +
    statusBadge(p.status) +
    "</td>" +
    "<td>" +
    formatDate(p.endDate) +
    "</td>" +
    "<td>" +
    progressBar(p.tasksDone, p.tasksTotal) +
    "</td>" +
    "</tr>";
}

projectsBody = document.querySelector("#projects-body");
if (projectsBody) {
  projectsBody.innerHTML = rows;
}

const query = "Портал";
const found = projects.filter((p) =>
  p.title.toLowerCase().includes(query.toLowerCase()),
);
show(
  "Найдено по запросу «" + query + "»: " + found.map((p) => p.title).join(", "),
);

function renderSummary() {
  const totalCount = document.querySelector("#total-count");
  const activeCount = document.querySelector("#active-count");
  const progressEl = document.querySelector("#progress");

  if (!totalCount) return;

  const done = projects.reduce((sum, p) => sum + p.tasksDone, 0);
  const total = projects.reduce((sum, p) => sum + p.tasksTotal, 0);

  totalCount.textContent = projects.length;
  activeCount.textContent = projects.filter(
    (p) => p.status === "in-progress",
  ).length;
  progressEl.textContent = getProgress(done, total) + "%";
}

renderSummary();

function renderProjects(list) {
  const container = document.querySelector("#project-list");
  if (!container) return; // на этой странице списка проектов нет
  if (list.length === 0) {
    container.innerHTML = `<p class="empty">Проекты не найдены. Измените условия отбора.</p>`;
    return;
  }
  container.innerHTML = list.map(projectCardTemplate).join("");
}

function projectCardTemplate(p) {
  return `
    <article class="project-card" data-id="${p.id}">
      <h3>${p.title}</h3>
      <p class="client">${p.client}</p>
      <p class="deadline">Срок: ${formatDate(p.endDate)}</p>
      <div class="progress"><div class="progress__bar" style="width: ${getProgress(p.tasksDone, p.tasksTotal)}%"></div></div>
      <span class="${getStatusClass(p.status)}">${getStatusLabel(p.status)}</span>
    </article>
  `;
}

renderProjects(projects)


function renderTasks(list) {
  const container = document.querySelector("#task-list")
  if (!container) return
  if(list.length === 0) {
    container.innerHTML = `<p class="empty">Задачи не найдены. Измените условия отбора.</p>`;
  }

  container.innerHTML = list.map(taskRowTemplate).join("")
}

function taskRowTemplate(t) {
  //Просроченные задачи должны получать дополнительный класс task--overdue, оформленный красной рамкой. Используйте функцию isOverdue из файла utils.js.
  const overdueClass = isOverdue(t.deadline) ? "task--overdue" : "";
  return `
              <article class="task-item ${overdueClass}" data-id="${t.id}">
              <p><strong>Задача: </strong>${t.title}</p>
              <p><strong>Исполнитель: </strong>${t.assignee}</p>
              <p class="deadline">Срок: ${formatDate(t.deadline)}</p>
              <span class="${getStatusClass(t.status)}">${getStatusLabel(t.status)}</span>
            </article>
  `
}

renderTasks(tasks)

const searchInput = document.querySelector("#search");
const statusFilter = document.querySelector("#status-filter");
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const result = projects
    .filter(p => status === "all" || p.status === status)
    .filter(p => p.title.toLowerCase().includes(query));
  renderProjects(result);
}

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
applyFilters();   // первый вывод при загрузке страницы
