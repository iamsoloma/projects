export default function Header() {
    const today = new Date().toLocaleDateString("ru-RU")
    return (
        <header className="header">
            <h1>Система управления проектами</h1>
            <p className="header__date">Сегодня: {today}</p>
        </header>
    )
}