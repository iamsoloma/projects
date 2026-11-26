import { useEffect } from "react";

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
