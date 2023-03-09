import { useState } from "react";
import IFood from "../../interfaces/food";
import Button from "../../components/button";
import FoodGrid from "./foodGrid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import "./foodModalDialog.css";

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
  const [food, setFood] = useState<IFood>(selectedFood);
  const gridStyle = {
    padding: "0 1em 2em 1em",
    height: `${58 + food.froms.length * 25}px`,
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <div style={gridStyle}>
        <FoodGrid food={food} editable={true} onEditCell={setFood} />
        <button
          className="modal_plus"
          onClick={() => {
            let newFood = { ...food };
            newFood.froms.push(food.tos.slice(-1)[0]);
            newFood.tos.push(food.tos.slice(-1)[0] + 100);
            newFood.ranges.push(food.ranges.slice(-1)[0]);
            newFood.sizes.push(food.sizes.slice(-1)[0]);
            newFood.foodRates.push(food.foodRates.slice(-1)[0]);
            newFood.prices.push(food.prices.slice(-1)[0]);
            newFood.distributions.push(food.distributions.slice(-1)[0]);
            setFood(newFood);
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
        <button
          className="modal_moins"
          onClick={() => {
            let newFood = { ...food };
            newFood.froms.pop();
            newFood.tos.pop();
            newFood.ranges.pop();
            newFood.sizes.pop();
            newFood.foodRates.pop();
            newFood.prices.pop();
            newFood.distributions.pop();
            setFood(newFood);
          }}
        >
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
