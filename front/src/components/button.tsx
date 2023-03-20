import "./button.css";

interface IButton {
  title?: string;
  onClick: () => void;
  children?: React.ReactElement;
  color?: string;
  width?: string;
}

export default function Button({
  title,
  children,
  color,
  onClick,
  width,
}: IButton) {
  return (
    <button
      className={`bioponi_button_${color ?? "orange"}`}
      onClick={onClick}
      style={{ "--width": width ?? "auto" } as React.CSSProperties}
    >
      <div>{children}</div>
      {title && <p style={{ paddingLeft: "0.75em" }}>{title}</p>}
    </button>
  );
}
