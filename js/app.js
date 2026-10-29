function show(text) {
  document.querySelector("#output").innerHTML += "<p>" + text + "</p>";
}

show("Система управления проектами");
//show("Сценарий подключён " + new Date().toLocaleString("ru-RU"));
const projectTitle = "CRM-система для отдела прода";
const client = "ООО «Ромашка»";
const manager = "Иванов И.И.";
const startDate = "01.03.2026";
const endDate = "30.11.2026";

const totalTasks = 12;
let doneTasks = 7;
const percent = Math.round((doneTasks / totalTasks) * 100);

show("<strong>" + projectTitle + "</strong>");
show("Заказчик: " + client + ", руководитель: " + manager);
show("Сроки: с " + startDate + " по " + endDate);
show(`Выполнено ${doneTasks} из ${totalTasks} задач (${percent}%)`);

document.title = projectTitle;

const taskTitle = "Разработка базы данных";
const taskStatus = "in-progress";
const taskDeadline = "10.03.2026";
const today = "15.03.2026";
let statusLabel;
if (taskStatus === "new") {
  statusLabel = "Новая";
} else if (taskStatus === "in-progress") {
  statusLabel = "В работе";
} else if (taskStatus === "done") {
  statusLabel = "Завершена";
} else {
  statusLabel = "Статус не определён";
}

let taskLine =
  taskTitle +
  " — " +
  "<span class='badge badge--" +
  taskStatus +
  "'>" +
  statusLabel +
  "</span>";

const isTaskOverdue = taskStatus != "done" && taskDeadline < today;
if (isTaskOverdue) {
  taskLine += "<span class='overdue'> ПРОСРОЧЕНА!</span>";
}

show(taskLine);

const taskStatuses = [
  "done",
  "done",
  "in-progress",
  "new",
  "done",
  "in-progress",
  "new",
];
let newCount = 0;
let inProgressCount = 0;
let doneCount = 0;

for (const status of taskStatuses) {
  if (status === "new") {
    newCount++;
  } else if (status === "in-progress") {
    inProgressCount++;
  } else if (status === "done") {
    doneCount++;
  }
}

const total = taskStatuses.length;
const progress = Math.round((doneCount / total) * 100);
show(
  "Задач в проекте: " +
    total +
    " (новых " +
    newCount +
    ", в работе " +
    inProgressCount +
    ", завершено " +
    doneCount +
    ")",
);

show("<div class='progress'><div class='progress__bar' style='width: "+progress+"%'></div></div>")
show("Готовность проекта: " + progress + "%");
