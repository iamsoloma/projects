export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__window">
        <h3 className="modal__title">{title}</h3>
        <button className="modal__close" onClick={onClose} aria-label="Закрыть">×</button>
        {children}
      </div>
    </div>
  );
}
