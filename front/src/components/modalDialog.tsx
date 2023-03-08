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

export default function ModalDialog({
  title,
  open,
  onClose,
  selectedFood,
}: IModal) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <FoodGrid food={selectedFood} />
      <Button
        title="Valider"
        onClick={onClose}
        color="blue"
        children={<i className="fas fa-cheese"></i>}
      />
    </Dialog>
  );
}
