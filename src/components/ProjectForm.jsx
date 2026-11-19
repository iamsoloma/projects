import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  client: "",
  manager: "",
  startDate: "",
  endDate: "",
};

export default function ProjectForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function validate(data) {
    const result = [];
    if (data.title.trim().length < 3) {
      result.push("Название проекта должно содержать не менее трёх символов");
    }
    if (!data.client.trim()) {
      result.push("Укажите заказчика");
    }
    if (!data.endDate) {
      result.push("Укажите срок завершения");
    } else if (data.startDate && data.endDate <= data.startDate) {
      result.push("Срок завершения должен быть позже даты начала");
    }
    return result;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (found.length > 0) return;
    onCreate({
      ...form,
      id: Date.now(),
      manager: form.manager.trim() || "Не назначен",
      status: "new",
      tasksTotal: 0,
      tasksDone: 0,
    });
    setForm(EMPTY_FORM);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Новый проект</h3>
      {errors.length > 0 && (
        <div className="errors">
          <ul>
            {errors.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      )}
      <label htmlFor="title">Название проекта</label>
      <input
        id="title"
        name="title"
        value={form.title}
        onChange={handleChange}
      />
      <label htmlFor="client">Заказчик</label>
      <input
        id="client"
        name="client"
        value={form.client}
        onChange={handleChange}
      />
      <label htmlFor="manager">Руководитель</label>
      <input
        id="manager"
        name="manager"
        value={form.manager}
        onChange={handleChange}
      />
      <label htmlFor="startDate">Дата начала</label>
      <input
        type="date"
        id="startDate"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
      />
      <label htmlFor="endDate">Срок завершения</label>
      <input
        type="date"
        id="endDate"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
      />
      <button type="submit">Создать проект</button>
    </form>
  );
}
