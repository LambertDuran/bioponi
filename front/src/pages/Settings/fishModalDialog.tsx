import { useState, useEffect, useRef } from "react";
import IFish, { addRow, removeRow } from "../../interfaces/fish";
import IFood from "../../interfaces/food";
// import validateFood from "./validateFood";
// import { postFood, putFood } from "../../services/food";
import Button from "../../components/button";
import FishGrid from "./fishGrid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
// import { toast } from "react-toastify";
import "./fishModalDialog.css";
import { margin } from "@mui/system";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
  fish: IFish;
  setFish: (fish: IFish) => void;
  foods: IFood[];
  //   onFoodModification: (food: IFood) => void;
  isCreation: boolean;
}

export default function FoodModalDialog({
  title,
  open,
  onClose,
  fish,
  foods,
  setFish,
}: //   onFoodModification,
//   isCreation,
IModal) {
  const [copyFish, setCopyFish] = useState<IFish>(fish);

  const gridStyle = {
    padding: "0 1em 2em 1em",
    height: `${58 + copyFish.weeks.length * 25}px`,
    width: "210px",
  };

  async function handleSubmit() {}

  const inputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (inputElement.current) {
        inputElement.current.focus();
      }
    }, 0);
  }, [open]);

  useEffect(() => {
    setCopyFish(fish);
  }, [fish]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle style={{ paddingBottom: 0 }}>
        {title}
        <input
          ref={inputElement}
          type="text"
          id="food_name"
          value={copyFish.name}
          onChange={(e) => setCopyFish({ ...copyFish, name: e.target.value })}
          className="fishModal_name"
          autoFocus
        />
      </DialogTitle>
      <div className="fishModal_food">
        <label>
          Aliment :
          <select
            className="fishModal_select"
            value={copyFish.food.name}
            onChange={(e) =>
              setCopyFish({
                ...copyFish,
                food: foods.find((food) => food.name === e.target.value)!,
              })
            }
          >
            {foods.map((food) => (
              <option key={food.name} value={food.name}>
                {food.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="fishModal_dialog">
        <div style={gridStyle}>
          <FishGrid fish={copyFish} editable={true} onEditCell={setCopyFish} />
          <div className="fishModal_plus_moins">
            <button
              className="fishModal_plus"
              onClick={() => setCopyFish(addRow({ ...copyFish }))}
            >
              <i className="fas fa-plus"></i>
            </button>
            <button
              className="fishModal_moins"
              onClick={() => {
                if (copyFish.weeks.length < 2) return;
                setCopyFish(removeRow({ ...copyFish }));
              }}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="fishModal_validate_button">
        <Button
          title="Valider"
          onClick={handleSubmit}
          children={<i className="fas fa-fish"></i>}
        />
      </div>
    </Dialog>
  );
}
