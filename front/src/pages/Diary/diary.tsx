import { useState, useEffect } from "react";
import Button from "../../components/button";
import EntranceModalDialog from "./entranceModalDialog";
import { getAllFish } from "../../services/fish";
import { getAllPool } from "../../services/pool";
import IPool from "../../interfaces/pool";
import IFish from "../../interfaces/fish";
import { orderBy } from "lodash";
import "./diary.css";

const iEntrance = 0;
const iWeighing = 1;
const iSale = 2;
const iTransfer = 3;
const iExit = 4;
const iMortality = 5;

const actions = [
  "Entrée du lot",
  "Pesée",
  "Vente",
  "Transfert",
  "Sortie définitive",
  "Mortalité",
];
const colors = ["orange", "salmon", "yellow", "grey", "blue", "black"];
const titles = [
  "Entrée du lot",
  "Pesée",
  "Vente",
  "Transfert",
  "Sortie définitive",
  "Mortalité",
];

const icons = [
  "fas fa-sign-in-alt",
  "fas fa-weight",
  "fas fa-dollar-sign",
  "fas fa-exchange-alt",
  "fas fa-sign-out-alt",
  "fas fa-skull",
];

export default function Diary() {
  const [action, setAction] = useState("");
  const [fishes, setFishes] = useState<IFish[]>([]);
  const [pools, setPools] = useState<IPool[]>([]);

  useEffect(() => {
    async function getFishes() {
      const allFish = await getAllFish();
      if (allFish && allFish.data) setFishes(allFish.data);
    }
    async function getPools() {
      const allPool = await getAllPool();
      if (allPool && allPool.data)
        setPools(orderBy(allPool.data, ["number"], ["asc"]));
    }

    getFishes();
    getPools();
  }, []);

  const displayDiary = fishes.length > 0 && pools.length > 0;

  return (
    <div>
      {displayDiary ? (
        <div className="diary_container">
          <div className="diary_but_container">
            {colors.map((color, index) => (
              <Button
                key={index}
                title={titles[index]}
                color={color}
                onClick={() => setAction(actions[index])}
                width={"13%"}
              >
                <i className={icons[index]}></i>
              </Button>
            ))}
          </div>
          <EntranceModalDialog
            open={action === actions[iEntrance]}
            title={actions[iEntrance]}
            onClose={() => setAction("")}
            isCreation={true}
            fishes={fishes}
            pools={pools}
          />
        </div>
      ) : (
        <div className="entrance_modDial_emptyList">
          <p>
            ⚠️ Vous devez définir un <strong>bassin</strong> et une
            <strong> espèce de poissons</strong> dans la page
            <strong> PARAMETRAGE</strong>⚠️
          </p>
        </div>
      )}
    </div>
  );
}
