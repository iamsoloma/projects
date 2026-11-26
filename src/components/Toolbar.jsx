export default function Toolbar({
  query,
  status,
  onQueryChange,
  onStatusChange,
}) {
  return (
    <div className="toolbar">
      <input
        type="search"
        className="toolbar__search"
        placeholder="Поиск по названию проекта"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <select
        className="toolbar__select"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">Все статусы</option>
        <option value="new">Новые</option>
        <option value="in-progress">В работе</option>
        <option value="done">Завершённые</option>
      </select>
    </div>
  );
}
