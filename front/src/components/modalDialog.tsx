import IFood from "../interfaces/food";
import Button from "./button";
import FoodGrid from "../pages/Settings/foodGrid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import "./modalDialog.css";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
  selectedFood: IFood;
}

export default function ModalDialog({
  title,
  open,
  onClose,
  selectedFood,
}: IModal) {
  const gridStyle = {
    padding: "0 1em 2em 1em",
    height: `${50 + selectedFood.froms.length * 32}px`,
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <div style={gridStyle}>
        <FoodGrid food={selectedFood} editable={true} />
        <button className="modal_plus">
          <i className="fas fa-plus"></i>
        </button>
        <button className="modal_moins">
          <i className="fas fa-minus"></i>
        </button>
      </div>
      <div className="modal_validate_button">
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
