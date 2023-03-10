import { useEffect, useState, useRef } from "react";
import IFood from "../../interfaces/food";
import validateFood from "./validateFood";
import { postFood } from "../../services/food";
import Button from "../../components/button";
import FoodGrid from "./foodGrid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { toast } from "react-toastify";
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

  async function handleSubmit() {
    const { error } = validateFood(food);
    if (error) {
      toast.error(`Format des données incorrect : ${error.details[0].message}`);
      return;
    }

    const { food: newFood, error: error2 } = await postFood(food);
    if (newFood) {
      toast.success("Nouvel aliment créé");
      onClose();
    } else toast.error(error2);
  }

  const inputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (inputElement.current) {
        inputElement.current.focus();
      }
    }, 0);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>
        {title}
        <input
          ref={inputElement}
          type="text"
          id="food_name"
          value={food.name}
          onChange={(e) => setFood({ ...food, name: e.target.value })}
          className="modal_name"
          autoFocus
        />
      </DialogTitle>
      <div style={gridStyle}>
        <FoodGrid food={food} editable={true} onEditCell={setFood} />
        <div className="modal_plus_moins">
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
              if (food.froms.length < 2) return;
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
      </div>
      <div className="modal_validate_button">
        <Button
          title="Valider"
          onClick={handleSubmit}
          color="blue"
          children={<i className="fas fa-cheese"></i>}
        />
      </div>
    </Dialog>
  );
}
