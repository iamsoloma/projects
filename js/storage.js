const PROJECTS_KEY = "pms.projects";
const TASKS_KEY = "pms.tasks";

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new Error("Не удалось сохранить изменения в браузере.", {
      cause: error,
    });
  }
}

function load(key) {
  const serializedValue = localStorage.getItem(key);
  if (serializedValue === null) return null;

  try {
    return JSON.parse(serializedValue);
  } catch (error) {
    throw new Error("Сохранённые данные повреждены. Сбросьте данные и повторите.", {
      cause: error,
    });
  }
}
