import "./button.css";

interface IButton {
  title: string;
  onClick: () => void;
  children?: React.ReactElement;
}

export default function Button({ title, onClick, children }: IButton) {
  return (
    <button className="bioponi_button" onClick={onClick}>
      {children}
      {title}
    </button>
  );
}
