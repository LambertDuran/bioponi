import { useState, useEffect } from "react";
import Button, { litteralColors } from "../../components/button";
import ActionModalDialog from "./actionModalDialog";
import RemoveModalDialog from "./removeModalDialog";
import { getAllFish } from "../../services/fish";
import { getAllPool } from "../../services/pool";
import { getAllActions } from "../../services/action";
import IPool from "../../interfaces/pool";
import IFish from "../../interfaces/fish";
import IAction from "../../interfaces/action";
import ActionsGrid from "./actionsGrid";
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
  const [isCreation, setIsCreation] = useState(true);
  const [actionType, setActionType] = useState("");
  const [action, setAction] = useState<IAction | null>(null);
  const [actions, setActions] = useState<IAction[]>([]);
  const [fishes, setFishes] = useState<IFish[]>([]);
  const [pools, setPools] = useState<IPool[]>([]);
  const [openRemove, setOpenRemove] = useState(false);

  useEffect(() => {
    async function getFishes() {
      const allFish = await getAllFish();
      if (allFish && allFish.fish) setFishes(allFish.fish);
    }
    async function getPools() {
      const allPool = await getAllPool();
      if (allPool && allPool.data) setPools(allPool.data);
    }
    async function getActions() {
      const allActions = await getAllActions();
      if (allActions && allActions.data) setActions(allActions.data);
    }
    getActions();
    getFishes();
    getPools();
  }, []);

  useEffect(() => {
    if (action) {
      if (!openRemove) {
        setIsCreation(false);
        setOpen(true);
        setActionType(action.type);
      } else {
        setOpenRemove(true);
      }
    }
  }, [action, openRemove]);

  const displayDiary = fishes.length > 0 && pools.length > 0;

  const gridStyle = {
    padding: "0 1em 2em 1em",
    marginTop: "1em",
    height: `${90 + (actions.length ? actions.length * 25 : 100)}px`,
  };

  return (
    <div>
      {displayDiary ? (
        <div className="diary_container">
          <div className="diary_but_container">
            {actionList.map((action, index) => (
              <Button
                key={index}
                title={action}
                color={litteralColors[index]}
                onClick={() => {
                  setActionType(action);
                  setOpen(true);
                  setIsCreation(true);
                  setAction(null);
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
            isCreation={isCreation}
            fishes={fishes}
            pools={pools}
            actions={actions}
            action={action}
            actionType={actionType}
            setActions={setActions}
          />
          <RemoveModalDialog
            open={openRemove}
            onClose={() => setOpenRemove(false)}
            action={action}
            actions={actions}
            setActions={setActions}
          />
          <p className="diary_text">Historique :</p>
          <div style={gridStyle}>
            <ActionsGrid
              actions={actions}
              setAction={setAction}
              setOpenRemove={setOpenRemove}
            />
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
