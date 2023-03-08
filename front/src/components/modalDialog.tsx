import "./modalDialog.css";

interface IModal {
  title: string;
}

export default function ModalDialog({ title }: IModal) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>Modal content goes here...</p>
        <button className="close-modal">Créer</button>
      </div>
    </div>
  );
}
