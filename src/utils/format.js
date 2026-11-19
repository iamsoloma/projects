export function getStatusLabel(status) {
  if (status === "new") return "Новая";
  if (status === "in-progress") return "В работе";
  if (status === "done") return "Завершена";
  return "Статус не определён";
}

export function getProgress(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("ru-RU");
}
