import IFood from "../interfaces/food";
import Button from "./button";
import FoodGrid from "../pages/Settings/foodGrid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
  selectedFood: IFood;
}

const p1 = { padding: "1em" };

export default function ModalDialog({
  title,
  open,
  onClose,
  selectedFood,
}: IModal) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <div
        style={{
          padding: "1em",
          height: `${50 + selectedFood.froms.length * 32}px`,
        }}
      >
        <FoodGrid food={selectedFood} />
      </div>
      <div style={p1}>
        <Button
          title="Valider"
          onClick={onClose}
          color="blue"
          children={<i className="fas fa-cheese"></i>}
        />
      </div>
    </Dialog>
  );
}
