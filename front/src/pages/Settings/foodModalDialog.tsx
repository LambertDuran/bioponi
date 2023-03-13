import { useState, useEffect, useRef } from "react";
import IFood, { addRow, removeRow } from "../../interfaces/food";
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
  food: IFood;
  setFood: (food: IFood) => void;
  onCreatedFood: (food: IFood) => void;
}

export default function ModalDialog({
  title,
  open,
  onClose,
  food,
  setFood,
  onCreatedFood,
}: IModal) {
  const [copyFood, setCopyFood] = useState<IFood>(food);

  const gridStyle = {
    padding: "0 1em 2em 1em",
    height: `${58 + copyFood.froms.length * 25}px`,
  };

  async function handleSubmit() {
    const { error } = validateFood(copyFood);
    if (error) {
      toast.error(`Format des données incorrect : ${error.details[0].message}`);
      return;
    }
    const { food: newFood, error: error2 } = await postFood(copyFood);
    if (newFood) {
      toast.success("Nouvel aliment créé");
      onCreatedFood(newFood);
      setFood(newFood);
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

  useEffect(() => {
    setCopyFood(food);
  }, [food]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>
        {title}
        <input
          ref={inputElement}
          type="text"
          id="food_name"
          value={copyFood.name}
          onChange={(e) => setCopyFood({ ...copyFood, name: e.target.value })}
          className="modal_name"
          autoFocus
        />
      </DialogTitle>
      <div style={gridStyle}>
        <FoodGrid food={copyFood} editable={true} onEditCell={setCopyFood} />
        <div className="modal_plus_moins">
          <button
            className="modal_plus"
            onClick={() => setCopyFood(addRow({ ...copyFood }))}
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            className="modal_moins"
            onClick={() => {
              if (copyFood.froms.length < 2) return;
              setCopyFood(removeRow({ ...copyFood }));
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
