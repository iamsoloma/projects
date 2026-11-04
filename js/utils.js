function getStatusLabel(status) {
  const labels = {
    new: "Новая",
    "in-progress": "В работе",
    done: "Завершена",
  };
  return labels[status] || "Статус не определён";
}

function getStatusClass(status) {
  return `badge badge--${status}`;
}

function getProgress(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

function isOverdue(deadline, status) {
  if (!deadline || status === "done") return false;
  const deadlineDate = new Date(`${deadline}T23:59:59`);
  return !Number.isNaN(deadlineDate.getTime()) && deadlineDate < new Date();
}

function formatDate(dateString) {
  if (!dateString) return "Не указана";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Некорректная дата";
  return new Intl.DateTimeFormat("ru-RU").format(date);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return replacements[character];
  });
}

function statusBadge(status) {
  return `<span class="${getStatusClass(status)}">${escapeHtml(getStatusLabel(status))}</span>`;
}

function progressBar(completed, total) {
  const progress = getProgress(completed, total);
  return `
    <div class="progress" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
      <div class="progress__bar" style="width: ${progress}%"></div>
    </div>
  `;
}
