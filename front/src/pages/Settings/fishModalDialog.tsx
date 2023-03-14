import { useState, useEffect, useRef } from "react";
import IFish, { addRow, removeRow } from "../../interfaces/fish";
import IFood from "../../interfaces/food";
import validateFish from "./validateFish";
import { postFish, putFish } from "../../services/fish";
import Button from "../../components/button";
import FishGrid from "./fishGrid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { toast } from "react-toastify";
import "./fishModalDialog.css";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
  fish: IFish | null;
  setFish: (fish: IFish) => void;
  foods: IFood[];
  onFishModification: (fish: IFish) => void;
  isCreation: boolean;
}

export default function FishModalDialog({
  title,
  open,
  onClose,
  fish,
  foods,
  setFish,
  isCreation,
  onFishModification,
}: IModal) {
  const [copyFish, setCopyFish] = useState<IFish | null>(fish);
  const gridStyle = {
    padding: "0 1em 2em 1em",
    height: `${58 + (copyFish ? copyFish.weeks.length * 25 : 0)}px`,
    width: "210px",
  };

  async function handleSubmit() {
    console.log("handleSubmit");
    if (!copyFish) return;
    const { joiError } = validateFish(copyFish);
    if (joiError) {
      toast.error(
        `Format des données incorrect : ${joiError.details[0].message}`
      );
      return;
    }

    let data: { fish: IFish | null; error: string };
    if (isCreation) data = await postFish(copyFish);
    else data = await putFish(copyFish);
    if (data.fish) {
      toast.success(
        `Poisson ${data.fish.name} ${isCreation ? " créé" : " modifié"}`
      );
      onFishModification(data.fish);
      setFish(data.fish);
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
    setCopyFish(fish);
    console.log("fish", fish);
  }, [fish]);

  // useEffect(() => {
  //   if (copyFish.food.name === "") {
  //     setCopyFish({
  //       ...copyFish,
  //       food: foods[0],
  //     });
  //   }
  // }, [copyFish, foods]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle style={{ paddingBottom: 0 }}>
        {title}
        <input
          ref={inputElement}
          type="text"
          id="food_name"
          value={copyFish?.name}
          onChange={(e) => setCopyFish({ ...copyFish!, name: e.target.value })}
          className="fishModal_name"
          autoFocus
        />
      </DialogTitle>
      <div
        className={
          isCreation ? "fishModal_food_creation" : "fishModal_food_modif"
        }
      >
        <label>
          Aliment :
          <select
            className="fishModal_select"
            value={copyFish?.food.name}
            onChange={(e) =>
              setCopyFish({
                ...copyFish!,
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
          <FishGrid fish={copyFish!} editable={true} onEditCell={setCopyFish} />
          <div className="fishModal_plus_moins">
            <button
              className="fishModal_plus"
              onClick={() => setCopyFish(addRow({ ...copyFish! }))}
            >
              <i className="fas fa-plus"></i>
            </button>
            <button
              className="fishModal_moins"
              onClick={() => {
                if (copyFish!.weeks.length < 2) return;
                setCopyFish(removeRow({ ...copyFish! }));
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
