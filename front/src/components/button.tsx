import "./button.css";

interface IButton {
  title?: string;
  onClick: () => void;
  children?: React.ReactElement;
  color?: string;
}

export default function Button({ title, children, color, onClick }: IButton) {
  return (
    <button className={`bioponi_button_${color ?? "orange"}`} onClick={onClick}>
      <div>{children}</div>
      {title && <p style={{ paddingLeft: "0.75em" }}>{title}</p>}
    </button>
  );
}
