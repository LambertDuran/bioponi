import { useForm } from "react-hook-form";
import IPool from "../../interfaces/pool";
import IFish from "../../interfaces/fish";
import Calendar from "../../components/calendar";
import Button from "../../components/button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import "./entranceModalDialog.css";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
  fishes: IFish[];
  pools: IPool[];
  // food: IFood | null;
  // setFood: (food: IFood) => void;
  // onFoodModification: (food: IFood) => void;
  isCreation: boolean;
}

export default function EntranceModalDialog({
  open,
  title,
  onClose,
  fishes,
  pools,
  // food,
  // setFood,
  // onFoodModification,
  isCreation,
}: IModal) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const displayError = (type: string) => {
    const jsxError = (
      <>
        <div></div>
        <div className="entrance_modDial_error">
          Format ou valeur incorrecte
        </div>
      </>
    );
    if (type === "total_weight") return errors.total_weight && jsxError;
    else if (type === "fish_number") return errors.fish_number && jsxError;
    else if (type === "average_weight")
      return errors.average_weight && jsxError;
  };

  const onSubmit = (data: any) => console.log(data);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle className="entrance_modDial_title">{title}</DialogTitle>
      <form
        id="entrance_form"
        onSubmit={handleSubmit(onSubmit)}
        className="entrance_modDial_container"
      >
        <Calendar />
        <div className="entrance_modDial_form">
          <div className="entrance_modDial_grid">
            <div>N° de bassin :</div>
            <select
              className="entrance_modial_select"
              {...register("pool_number", { required: true })}
            >
              {pools.map((pool) => (
                <option key={pool.id}>{pool.number}</option>
              ))}
            </select>
            <div>Espèce de poissons :</div>
            <select
              className="entrance_modial_select"
              {...register("fish_species", { required: true })}
            >
              {fishes.map((fish) => (
                <option key={fish.id}>{fish.name}</option>
              ))}
            </select>
            <div>Masse totale(kg) :</div>
            <input
              className="entrance_modial_select"
              form="entrance_form"
              placeholder="Masse totale(kg)"
              {...register("total_weight", {
                required: true,
                min: 0,
                max: 10000,
                pattern: /^[0-9]+$/,
              })}
            />
            {displayError("total_weight")}
            <div>Nombre de poissons :</div>
            <input
              className="entrance_modial_select"
              placeholder="nb poissons"
              form="entrance_form"
              {...register("fish_number", {
                required: true,
                min: 0,
                max: 10000,
                pattern: /^[0-9]+$/,
              })}
            />
            {displayError("fish_number")}
            <div>Poids moyen(g) :</div>
            <input
              className="entrance_modial_select"
              placeholder="poids moyen"
              form="entrance_form"
              defaultValue={1000}
              {...register("average_weight", {
                required: true,
                min: 0,
                max: 10000,
                pattern: /^[0-9]+$/,
              })}
            />
            {displayError("average_weight")}
          </div>
          <input
            className="entrance_modDial_button"
            type="submit"
            value="Valider"
          ></input>
        </div>
      </form>
    </Dialog>
  );
}
