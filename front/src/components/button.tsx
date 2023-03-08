import "./button.css";

interface IButton {
  title: string;
  onClick: () => void;
  children?: React.ReactElement;
  color?: string;
  isModal?: boolean;
}

export default function Button({
  title,
  onClick,
  children,
  color,
  isModal,
}: IButton) {
  return (
    <button
      className={`${isModal ? "open-modal" : ""} bioponi_button_${
        color ?? "orange"
      }`}
      onClick={onClick}
    >
      <div>{children}</div>
      <p>{title}</p>
    </button>
  );
}
