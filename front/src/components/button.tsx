import "./button.css";

interface IButton {
  title?: string;
  onClick: () => void;
  children?: React.ReactElement;
  color?: string;
  width?: string;
}

const litteralColors = ["orange", "salmon", "yellow", "grey", "blue", "black"];

const colors = [
  "#fd7702",
  "#ff906a",
  "#f6bd41",
  "#b9c6d7",
  "#7991bd",
  "#020d21",
];
const hoverColors = [
  "#ff8e00",
  "#ff9e7a",
  "#f6c94a",
  "#94a3c0",
  "#94a3c0",
  "#28292b",
];

export default function Button({
  title,
  children,
  color,
  onClick,
  width,
}: IButton) {
  return (
    <button
      className="bioponi_button"
      onClick={onClick}
      style={
        {
          "--width": width ?? "auto",
          "--color": colors[litteralColors.findIndex((c) => c === color)],
          "--hoverColor":
            hoverColors[litteralColors.findIndex((c) => c === color)],
          "--textColor": color === "black" ? "white" : "black",
        } as React.CSSProperties
      }
    >
      <div>{children}</div>
      {title && <p style={{ paddingLeft: "0.75em" }}>{title}</p>}
    </button>
  );
}
