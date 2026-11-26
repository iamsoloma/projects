import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <h2>Раздел не найден</h2>
      <p>Такой страницы не существует. Проверьте адрес или вернитесь на главную.</p>
      <Link to="/" className="btn">К списку проектов</Link>
    </section>
  );
}
