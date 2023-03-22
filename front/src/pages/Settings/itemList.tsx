import Chip from "@mui/material/Chip";
import "./itemList.css";

interface IItemList<T> {
  title: string;
  items: T[];
  selectedItem: T;
  setSelectedItem: (item: T) => void;
  color: string;
}

export default function ItemList({
  title,
  items,
  selectedItem,
  setSelectedItem,
  color,
}: IItemList<any>) {
  const unselectedItemStyle = {
    border: `2px solid ${color}`,
    cursor: "pointer",
    margin: "1em 0 1em 1em",
    backgroundColor: "transparent",
  };
  const selectedItemStyle = {
    backgroundColor: `${color}`,
    cursor: "pointer",
    margin: "1em 0 1em 1em",
    border: "1px solid black",
    fontWeight: "bold",
  };

  return (
    <div className="itemList_container" style={{ paddingTop: 0 }}>
      <p style={{ fontSize: "1.25em" }}>{title}</p>
      {items.map((item: any) => (
        <Chip
          key={item.id}
          label={item.name}
          onClick={() => setSelectedItem(item)}
          style={
            selectedItem && selectedItem.name === item.name
              ? selectedItemStyle
              : unselectedItemStyle
          }
        />
      ))}
    </div>
  );
}
