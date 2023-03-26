import { useState, useEffect } from "react";
import Button, { litteralColors } from "../../components/button";
import ActionModalDialog from "./actionModalDialog";
import { getAllFish } from "../../services/fish";
import { getAllPool } from "../../services/pool";
import { getAllActions } from "../../services/action";
import IPool from "../../interfaces/pool";
import IFish from "../../interfaces/fish";
import IAction from "../../interfaces/action";
import ActionsGrid from "./actionsGrid";
import { orderBy } from "lodash";
import "./diary.css";

const actionList = [
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
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actions, setActions] = useState<IAction[]>([]);
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
    async function getActions() {
      const allActions = await getAllActions();
      if (allActions && allActions.data) {
        setActions(orderBy(allActions.data, ["date"], ["asc"]));
      }
    }
    getActions();
    getFishes();
    getPools();
  }, []);

  const displayDiary = fishes.length > 0 && pools.length > 0;

  const gridStyle = {
    width: "97%",
    padding: "0 1em 2em 1em",
    marginTop: "1em",
    height: `${58 + (actions ? actions.length * 25 : 0)}px`,
  };

  return (
    <div>
      {displayDiary ? (
        <div className="diary_container">
          <div className="diary_but_container">
            {litteralColors.map((color, index) => (
              <Button
                key={index}
                title={actionList[index]}
                color={color}
                onClick={() => {
                  setActionType(actionList[index]);
                  setOpen(true);
                }}
                width={"13%"}
              >
                <i className={icons[index]}></i>
              </Button>
            ))}
          </div>
          <ActionModalDialog
            open={open}
            onClose={() => {
              setActionType("");
              setOpen(false);
            }}
            isCreation={true}
            fishes={fishes}
            pools={pools}
            actions={actions}
            actionType={actionType}
            setActions={setActions}
          />
          <p className="diary_text">Historique :</p>
          <div style={gridStyle}>
            <ActionsGrid actions={actions} />
          </div>
        </div>
      ) : (
        <div className="action_modDial_emptyList">
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

export { actionList };
