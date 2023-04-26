import { useState, useEffect, useRef } from "react";
import IFood, { addRow, removeRow } from "../../interfaces/food";
import validateFood from "./validateFood";
import { postFood, putFood } from "../../services/food";
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
  food: IFood | null;
  setFood: (food: IFood) => void;
  onFoodModification: (food: IFood) => void;
  isCreation: boolean;
}

export default function FoodModalDialog({
  title,
  open,
  onClose,
  food,
  setFood,
  onFoodModification,
  isCreation,
}: IModal) {
  const [copyFood, setCopyFood] = useState<IFood | null>(food);

  const gridStyle = {
    padding: "0 1em 2em 1em",
    height: `${90 + (copyFood ? copyFood.froms.length * 25 : 0)}px`,
  };

  async function handleSubmit() {
    console.log("handleSubmit");
    if (!copyFood) return;
    const { joiError } = validateFood(copyFood);
    if (joiError) {
      toast.error(
        `Format des données incorrect : ${joiError.details[0].message}`
      );
      return;
    }

    let data: { food: IFood | null; error: string };
    if (isCreation) data = await postFood(copyFood);
    else data = await putFood(copyFood);
    if (data.food) {
      toast.success(
        `Plan d'alimentaion ${data.food.name} ${
          isCreation ? " créé" : " modifié"
        }`
      );
      onFoodModification(data.food);
      setFood(data.food);
      onClose();
    } else toast.error(data.error);
  }

  const inputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (inputElement.current) {
        inputElement.current.focus();
      }
    }, 0);
  }, [open]);

  useEffect(() => {
    setCopyFood(food);
  }, [food]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth={true}>
      <DialogTitle>
        {title}
        <input
          ref={inputElement}
          type="text"
          id="food_name"
          value={copyFood?.name}
          onChange={(e) => setCopyFood({ ...copyFood!, name: e.target.value })}
          className="foodModal_name"
          autoFocus
        />
      </DialogTitle>
      <div style={gridStyle}>
        <FoodGrid food={copyFood!} editable={true} onEditCell={setCopyFood} />
        <div className="foodModal_plus_moins">
          <button
            className="foodModal_plus"
            onClick={() => setCopyFood(addRow({ ...copyFood! }))}
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            className="foodModal_moins"
            onClick={() => {
              if (copyFood!.froms.length < 2) return;
              setCopyFood(removeRow({ ...copyFood! }));
            }}
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div className="foodModal_validate_button">
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
