import { useState, useEffect, useRef } from "react";
import IFish, { addRow, removeRow } from "../../interfaces/fish";
// import validateFood from "./validateFood";
// import { postFood, putFood } from "../../services/food";
import Button from "../../components/button";
// import FoodGrid from "./foodGrid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
// import { toast } from "react-toastify";
import "./foodModalDialog.css";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
  fish: IFish;
  setFish: (fish: IFish) => void;
  //   onFoodModification: (food: IFood) => void;
  isCreation: boolean;
}

export default function FoodModalDialog({
  title,
  open,
  onClose,
  fish,
  setFish,
}: //   onFoodModification,
//   isCreation,
IModal) {
  const [copyFish, setCopyFish] = useState<IFish>(fish);

  const gridStyle = {
    padding: "0 1em 2em 1em",
    height: `${58 + copyFish.weeks.length * 25}px`,
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
      <DialogTitle>
        {title}
        <input
          ref={inputElement}
          type="text"
          id="food_name"
          value={copyFish.name}
          onChange={(e) => setCopyFish({ ...copyFish, name: e.target.value })}
          className="modal_name"
          autoFocus
        />
      </DialogTitle>
      <div style={gridStyle}>
        {/* <FoodGrid food={copyFish} editable={true} onEditCell={setCopyFish} /> */}
        <div className="modal_plus_moins">
          <button
            className="modal_plus"
            onClick={() => setCopyFish(addRow({ ...copyFish }))}
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            className="modal_moins"
            onClick={() => {
              if (copyFish.weeks.length < 2) return;
              setCopyFish(removeRow({ ...copyFish }));
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
