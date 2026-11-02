function show(text) {
  output = document.querySelector("#output")
  if (!output) {
    console.log("На странице нет вывода!")
    return;
  }
  document.querySelector("#output").innerHTML += "<p>" + text + "</p>";
}

function getStatusLabel(status) {
  if (status === "new") {
    return "Новая";
  } else if (status === "in-progress") {
    return "В работе";
  } else if (status === "done") {
    return "Завершена";
  } else {
    return "Статус не определён";
  }
}

function getStatusClass(status) {
  return "badge badge--" + status;
}

function getProgress(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

function isOverdue(deadline, status) {
  if (status === "done") return false;
  return new Date(deadline) < new Date();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  
  return `${day}.${month}.${date.getFullYear()}`;
}

function statusBadge(status) {
  return (
    "<span class='" +
    getStatusClass(status) +
    "'>" +
    getStatusLabel(status) +
    "</span>"
  );
}

function progressBar(done, total) {
  return (
    "<div class='progress'><div class='progress__bar' style='width: " +
    getProgress(done, total) +
    "%'></div></div>"
  );
}
