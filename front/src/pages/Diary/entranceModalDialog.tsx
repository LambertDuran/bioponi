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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle className="entrance_modDial_title">{title}</DialogTitle>
      <div className="entrance_modDial_container">
        <Calendar />
        <div className="entrance_modDial_form">
          <div className="entrance_modDial_grid">
            <div>N° de bassin :</div>
            <select
              aria-label="N° de bassin :"
              className="entrance_modial_select"
            >
              {pools.map((pool) => (
                <option key={pool.id}>{pool.number}</option>
              ))}
            </select>
            <div>Espèce de poissons :</div>
            <select className="entrance_modial_select">
              {fishes.map((fish) => (
                <option key={fish.id}>{fish.name}</option>
              ))}
            </select>
            <div>Masse totale(kg) :</div>
            <input
              className="entrance_modial_select"
              placeholder="Masse totale(kg)"
            />
            <div>Nombre de poissons :</div>
            <input
              className="entrance_modial_select"
              placeholder="nb poissons"
            />
            <div>Poids moyen(g) :</div>
            <input
              className="entrance_modial_select"
              placeholder="poids moyen"
            />
          </div>
          <div className="entrance_modDial_button">
            <Button title="Valider" color="orange" onClick={() => onClose()}>
              <i className="fas fa-sign-in-alt" />
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
