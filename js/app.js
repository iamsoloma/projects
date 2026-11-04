const STATUS_ORDER = ["new", "in-progress", "done"];

const appState = {
  projects: [],
  tasks: [],
};

async function initializeApplication() {
  try {
    const storedProjects = load(PROJECTS_KEY);
    const storedTasks = load(TASKS_KEY);
    const fileProjects = await fetchProjects();
    const fileTasks = await fetchTasks();

    appState.projects = storedProjects || fileProjects;
    appState.tasks = storedTasks || fileTasks;
    synchronizeProjectProgress();
    bindProjectList();
    bindProjectForm();
    bindTaskStatusChanges();
    bindTaskForm();
    bindResetData();
    renderApplication();
  } catch (error) {
    console.error("Не удалось запустить приложение:", error);
    showApplicationError(error.message);
  }
}

async function fetchProjects() {
  const response = await fetch("data/projects.json", { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить проекты (HTTP ${response.status}).`);
  }

  const projects = await response.json();
  if (!Array.isArray(projects)) {
    throw new Error("Файл data/projects.json должен содержать список проектов.");
  }
  return projects;
}

async function fetchTasks() {
  const response = await fetch("data/tasks.json", { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить задачи (HTTP ${response.status}).`);
  }

  const tasks = await response.json();
  if (!Array.isArray(tasks)) {
    throw new Error("Файл data/tasks.json должен содержать список задач.");
  }
  return tasks;
}

function showApplicationError(message) {
  const errorContainer = document.querySelector("#app-error");
  if (!errorContainer) return;

  errorContainer.textContent = message;
  errorContainer.classList.remove("hidden");
}

function renderApplication() {
  renderSummary();
  renderProjectList();
  renderProjectsTable();
  renderHomeProjects();
  renderProjectDetails();
}

function renderSummary() {
  const totalCount = document.querySelector("#total-count");
  const activeCount = document.querySelector("#active-count");
  const progressElement = document.querySelector("#progress");
  if (!totalCount || !activeCount || !progressElement) return;

  const taskCount = appState.tasks.length;
  const completedTasks = appState.tasks.filter(
    (task) => task.status === "done",
  ).length;

  totalCount.textContent = String(appState.projects.length);
  activeCount.textContent = String(
    appState.projects.filter((project) => project.status === "in-progress")
      .length,
  );
  progressElement.textContent = `${getProgress(completedTasks, taskCount)}%`;
}

function getProjectTasks(projectId) {
  return appState.tasks.filter((task) => task.projectId === projectId);
}

function getProjectProgress(project) {
  const projectTasks = getProjectTasks(project.id);
  const completedTasks = projectTasks.filter(
    (task) => task.status === "done",
  ).length;
  return getProgress(completedTasks, projectTasks.length);
}

function notNewProject(projectId) {
  const projectTasks = getProjectTasks(projectId);
  const newTasks = projectTasks.filter((task) => task.status === "new");
  
  return projectTasks.length > 0 && newTasks.length === 0;
}

function synchronizeProjectProgress() {
  appState.projects.forEach((project) => {
    const projectTasks = getProjectTasks(project.id);
    project.tasksTotal = projectTasks.length;
    project.tasksDone = projectTasks.filter(
      (task) => task.status === "done",
    ).length;
  });

  appState.projects.forEach((project) => {

    if (notNewProject(project.id)) {
      if (project.status === "new") {
        project.status = "in-progress";
      }
    }

    const progress = getProjectProgress(project);
    if (progress === 100 && project.status !== "done") {
      project.status = "done";
    } else if (progress < 100 && project.status === "done") {
      project.status = "in-progress";
    }
  });
}

function renderProjectList(projects = getFilteredProjects()) {
  const container = document.querySelector("#project-list");
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML =
      '<p class="empty">Проекты не найдены. Измените условия отбора.</p>';
    return;
  }

  container.innerHTML = projects.map(projectCardTemplate).join("");
}

function projectCardTemplate(project) {
  const projectUrl = `project-alt.html?id=${encodeURIComponent(project.id)}`;
  const progress = getProjectProgress(project);
  return `
    <a class="project-card project-card-link" href="${projectUrl}">
      <span class="${getStatusClass(project.status)}">${escapeHtml(getStatusLabel(project.status))}</span>
      <h3>${escapeHtml(project.title)}</h3>
      <p>Заказчик: ${escapeHtml(project.client)}</p>
      <p>Срок завершения: ${formatDate(project.endDate)}</p>
      <p>Готовность: ${progress}%</p>
      ${progressBar(progress, 100)}
    </a>
  `;
}

function renderProjectsTable(projects = getFilteredProjects()) {
  const tableBody = document.querySelector("#projects-body");
  if (!tableBody) return;

  tableBody.innerHTML = projects
    .map(
      (project) => `
        <tr>
          <td><a href="project-alt.html?id=${encodeURIComponent(project.id)}">${escapeHtml(project.title)}</a>
            <small>(задач: ${getProjectTasks(project.id).length})</small></td>
          <td>${escapeHtml(project.client)}</td>
          <td>${statusBadge(project.status)}</td>
          <td>${formatDate(project.endDate)}</td>
          <td>${progressBar(getProjectProgress(project), 100)} ${getProjectProgress(project)}%</td>
        </tr>
      `,
    )
    .join("");
}

function renderHomeProjects() {
  const container = document.querySelector("#projects-grid");
  if (!container) return;

  const latestProjects = [...appState.projects]
    .sort((first, second) => second.endDate.localeCompare(first.endDate))
    .slice(0, 4);
  container.innerHTML = latestProjects.length
    ? latestProjects.map(projectCardTemplate).join("")
    : '<p class="empty">Пока нет проектов.</p>';
}

function renderProjectDetails() {
  const titleElement = document.querySelector("#project-title");
  const detailsElement = document.querySelector("#project-details");
  const taskList = document.querySelector("#task-list");
  if (!titleElement || !detailsElement || !taskList) return;

  const projectId = new URLSearchParams(window.location.search).get("id");
  const project = appState.projects.find(
    (item) => String(item.id) === projectId,
  );

  if (!project) {
    titleElement.textContent = "Проект не найден";
    detailsElement.innerHTML =
      '<p>Проект не найден. Вернитесь к <a href="projects-alt.html">списку проектов</a>.</p>';
    taskList.innerHTML = "";
    document.querySelector("#open-task-modal")?.classList.add("hidden");
    document.querySelector("#task-modal")?.classList.add("hidden");
    return;
  }

  document.querySelector("#open-task-modal")?.classList.remove("hidden");
  document.title = `Карточка проекта: ${project.title}`;
  titleElement.textContent = project.title;
  const progress = getProjectProgress(project);
  detailsElement.innerHTML = `
    <p><strong>Заказчик:</strong> ${escapeHtml(project.client)}</p>
    <p><strong>Руководитель:</strong> ${escapeHtml(project.manager || "Не назначен")}</p>
    <p><strong>Дата начала:</strong> ${formatDate(project.startDate)}</p>
    <p><strong>Срок завершения:</strong> ${formatDate(project.endDate)}</p>
    <p><strong>Статус:</strong> ${statusBadge(project.status)}</p>
    <p><strong>Готовность:</strong> <span id="project-progress">${progress}%</span></p>
    ${progressBar(progress, 100)}
  `;
  renderTasks(getProjectTasks(project.id));
}

function renderTasks(tasks) {
  const taskList = document.querySelector("#task-list");
  if (!taskList) return;

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty">В этом проекте пока нет задач.</p>';
    return;
  }

  taskList.innerHTML = tasks.map(taskTemplate).join("");
}

function taskTemplate(task) {
  const overdueClass = isOverdue(task.deadline, task.status)
    ? "task--overdue"
    : "";

  return `
    <article class="task-item ${overdueClass}" data-task-id="${encodeURIComponent(task.id)}">
      <p><strong>Задача:</strong> ${escapeHtml(task.title)}</p>
      <p><strong>Исполнитель:</strong> ${escapeHtml(task.assignee || "Не назначен")}</p>
      <p><strong>Срок:</strong> ${formatDate(task.deadline)}</p>
      <button type="button" class="task__status ${getStatusClass(task.status)}"
        aria-label="Изменить статус задачи «${escapeHtml(task.title)}»">
        ${escapeHtml(getStatusLabel(task.status))}
      </button>
    </article>
  `;
}

function getFilteredProjects() {
  const searchInput = document.querySelector("#search");
  const statusFilter = document.querySelector("#status-filter");
  const sortFilter = document.querySelector("#sort-filter");
  const query = searchInput ? searchInput.value.trim().toLocaleLowerCase("ru") : "";
  const status = statusFilter ? statusFilter.value : "all";

  const filteredProjects = appState.projects
    .filter((project) => status === "all" || project.status === status)
    .filter((project) =>
      project.title.toLocaleLowerCase("ru").includes(query),
    );

  const sortBy = sortFilter ? sortFilter.value : "deadline";
  if (sortBy === "title") {
    filteredProjects.sort((first, second) =>
      first.title.localeCompare(second.title, "ru"),
    );
  } else if (sortBy === "progress") {
    filteredProjects.sort(
      (first, second) =>
        getProjectProgress(second) - getProjectProgress(first),
    );
  } else {
    filteredProjects.sort((first, second) =>
      first.endDate.localeCompare(second.endDate),
    );
  }

  return filteredProjects;
}

function bindProjectList() {
  const searchInput = document.querySelector("#search");
  const statusFilter = document.querySelector("#status-filter");
  const sortFilter = document.querySelector("#sort-filter");
  const resetFiltersButton = document.querySelector("#reset-filter");
  const updateProjectList = () => {
    const filteredProjects = getFilteredProjects();
    renderProjectList(filteredProjects);
    renderProjectsTable(filteredProjects);
  };

  const requestedStatus = new URLSearchParams(window.location.search).get("status");
  if (STATUS_ORDER.includes(requestedStatus)) {
    statusFilter.value = requestedStatus;
  }

  searchInput?.addEventListener("input", updateProjectList);
  statusFilter?.addEventListener("change", updateProjectList);
  sortFilter?.addEventListener("change", updateProjectList);
  resetFiltersButton?.addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "all";
    sortFilter.value = "deadline";
    updateProjectList();
  });
}

function bindProjectForm() {
  const modal = document.querySelector("#modal");
  const form = document.querySelector("#project-form");
  if (!modal || !form) return;

  const openModal = () => {
    modal.classList.remove("hidden");
    form.querySelector("#project-name").focus();
  };
  document.querySelector("#open-modal")?.addEventListener("click", openModal);
  document.querySelectorAll('a[href="#open-modal"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });
  document.querySelector("#close-modal")?.addEventListener("click", closeProjectModal);
  document.querySelector("#cancel-modal")?.addEventListener("click", closeProjectModal);
  modal.querySelector(".modal__backdrop")?.addEventListener("click", closeProjectModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    createProjectFromForm(form);
  });
}

function closeProjectModal() {
  document.querySelector("#modal")?.classList.add("hidden");
  clearProjectFormErrors();
}

function createProjectFromForm(form) {
  const projectData = {
    title: form.querySelector("#project-name").value.trim(),
    client: form.querySelector("#project-client").value.trim(),
    manager: form.querySelector("#project-manager").value.trim(),
    startDate: form.querySelector("#project-start-date").value,
    endDate: form.querySelector("#project-end-date").value,
    status: form.querySelector("#project-status").value,
  };
  const errors = validateProject(projectData);
  displayProjectFormErrors(errors);
  if (errors.length > 0) return;

  const newProject = {
    ...projectData,
    id: createProjectId(),
    manager: projectData.manager || "Не назначен",
    tasksTotal: 0,
    tasksDone: 0,
  };
  appState.projects.push(newProject);

  try {
    persistApplicationData();
  } catch (error) {
    appState.projects.pop();
    showApplicationError(error.message);
    return;
  }

  form.reset();
  closeProjectModal();
  renderApplication();
  renderProjectList(getFilteredProjects());
}

function createProjectId() {
  const existingIds = new Set(appState.projects.map((project) => String(project.id)));
  let projectId = Date.now();
  while (existingIds.has(String(projectId))) projectId += 1;
  return projectId;
}

function validateProject(project) {
  const errors = [];
  if (project.title.length < 3) {
    errors.push("Название проекта должно содержать не менее трёх символов.");
  }
  if (!project.client) errors.push("Укажите заказчика.");
  if (!project.startDate) errors.push("Укажите дату начала проекта.");
  if (!project.endDate) {
    errors.push("Укажите срок завершения проекта.");
  } else if (
    project.startDate &&
    new Date(`${project.endDate}T00:00:00`) <=
      new Date(`${project.startDate}T00:00:00`)
  ) {
    errors.push("Срок завершения должен быть позже даты начала.");
  }
  if (!STATUS_ORDER.includes(project.status)) {
    errors.push("Выберите допустимый статус проекта.");
  }
  if (
    appState.projects.some(
      (existingProject) =>
        existingProject.title.toLocaleLowerCase("ru") ===
        project.title.toLocaleLowerCase("ru"),
    )
  ) {
    errors.push("Проект с таким названием уже существует.");
  }
  return errors;
}

function displayProjectFormErrors(errors) {
  const errorBox = document.querySelector("#form-errors");
  if (!errorBox) return;

  errorBox.replaceChildren();
  if (errors.length === 0) {
    errorBox.classList.add("hidden");
    return;
  }

  const list = document.createElement("ul");
  errors.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    list.append(item);
  });
  errorBox.append(list);
  errorBox.classList.remove("hidden");
}

function clearProjectFormErrors() {
  displayProjectFormErrors([]);
}

function bindTaskStatusChanges() {
  const taskList = document.querySelector("#task-list");
  if (!taskList) return;

  taskList.addEventListener("click", (event) => {
    const statusButton = event.target.closest(".task__status");
    if (!statusButton) return;

    const taskElement = statusButton.closest("[data-task-id]");
    const task = appState.tasks.find(
      (item) => String(item.id) === decodeURIComponent(taskElement.dataset.taskId),
    );
    if (!task) return;

    const previousStatus = task.status;
    task.status = nextStatus(task.status);
    synchronizeProjectProgress();
    try {
      persistApplicationData();
      renderApplication();
    } catch (error) {
      task.status = previousStatus;
      synchronizeProjectProgress();
      showApplicationError(error.message);
      renderProjectDetails();
    }
  });
}

function nextStatus(status) {
  const index = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

function bindTaskForm() {
  const modal = document.querySelector("#task-modal");
  const openButton = document.querySelector("#open-task-modal");
  const form = document.querySelector("#task-form");
  if (!modal || !openButton || !form) return;

  openButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
    form.querySelector("#task-title").focus();
  });
  modal.querySelector("#close-task-modal").addEventListener("click", closeTaskModal);
  modal.querySelector("#cancel-task-modal").addEventListener("click", closeTaskModal);
  modal.querySelector(".modal__backdrop").addEventListener("click", closeTaskModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTaskModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const projectId = new URLSearchParams(window.location.search).get("id");
    const project = appState.projects.find(
      (item) => String(item.id) === projectId,
    );
    if (!project) {
      displayTaskFormErrors(["Не удалось определить проект для новой задачи."]);
      return;
    }

    const taskData = {
      title: form.querySelector("#task-title").value.trim(),
      assignee: form.querySelector("#task-assignee").value.trim(),
      deadline: form.querySelector("#task-deadline").value,
    };
    const errors = validateTask(taskData);
    displayTaskFormErrors(errors);
    if (errors.length > 0) return;

    const newTask = {
      id: createTaskId(),
      projectId: project.id,
      title: taskData.title,
      assignee: taskData.assignee || "Не назначен",
      status: "new",
      deadline: taskData.deadline,
    };
    appState.tasks.push(newTask);
    synchronizeProjectProgress();

    try {
      persistApplicationData();
    } catch (error) {
      appState.tasks.pop();
      synchronizeProjectProgress();
      showApplicationError(error.message);
      renderApplication();
      return;
    }

    form.reset();
    displayTaskFormErrors([]);
    closeTaskModal();
    renderApplication();
  });
}

function closeTaskModal() {
  document.querySelector("#task-modal")?.classList.add("hidden");
  displayTaskFormErrors([]);
}

function validateTask(task) {
  const errors = [];
  if (task.title.length < 3) {
    errors.push("Название задачи должно содержать не менее трёх символов.");
  }
  if (!task.deadline) errors.push("Укажите срок выполнения задачи.");
  return errors;
}

function createTaskId() {
  const existingIds = new Set(appState.tasks.map((task) => String(task.id)));
  let taskId = Date.now();
  while (existingIds.has(String(taskId))) taskId += 1;
  return taskId;
}

function displayTaskFormErrors(errors) {
  const errorBox = document.querySelector("#task-form-errors");
  if (!errorBox) return;

  errorBox.replaceChildren();
  if (errors.length === 0) {
    errorBox.classList.add("hidden");
    return;
  }

  const list = document.createElement("ul");
  errors.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    list.append(item);
  });
  errorBox.append(list);
  errorBox.classList.remove("hidden");
}

function persistApplicationData() {
  save(PROJECTS_KEY, appState.projects);
  save(TASKS_KEY, appState.tasks);
}

function bindResetData() {
  document.querySelector("#reset-data")?.addEventListener("click", () => {
    if (!window.confirm("Удалить все внесённые изменения и восстановить исходные данные?")) {
      return;
    }

    try {
      localStorage.removeItem(PROJECTS_KEY);
      localStorage.removeItem(TASKS_KEY);
      window.location.reload();
    } catch (error) {
      showApplicationError(`Не удалось сбросить данные: ${error.message}`);
    }
  });
}

initializeApplication();
