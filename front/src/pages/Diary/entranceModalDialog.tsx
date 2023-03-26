import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IPool from "../../interfaces/pool";
import IFish from "../../interfaces/fish";
import IAction from "../../interfaces/action";
import Calendar from "../../components/calendar";
import { actionList } from "./diary";
import { colors } from "../../components/button";
import { postAction, putAction } from "../../services/action";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import "./entranceModalDialog.css";

const poolNumber = "N° de bassin";
const fishSpecies = "Espèce de poissons";
const lotName = "Nom du lot";
const totalWeight = "Masse totale(kg)";
const fishNumber = "Nombre de poissons";
const averageWeight = "Poids moyen(g)";
const newPool = "Nouveau bassin";

const propsByActionType = [
  [poolNumber, fishSpecies, lotName, totalWeight, fishNumber, averageWeight],
  [poolNumber, totalWeight, fishNumber, averageWeight],
  [poolNumber, totalWeight, fishNumber, averageWeight],
  [
    poolNumber,
    fishSpecies,
    lotName,
    totalWeight,
    fishNumber,
    averageWeight,
    newPool,
  ],
  [poolNumber, totalWeight, fishNumber, averageWeight],
  [poolNumber, totalWeight, fishNumber, averageWeight],
];

interface IModal {
  open: boolean;
  onClose: () => void;
  fishes: IFish[];
  pools: IPool[];
  actionType: string;
  actions: IAction[];
  setActions: (actions: IAction[]) => void;
  isCreation: boolean;
}

export default function EntranceModalDialog({
  open,
  onClose,
  fishes,
  pools,
  actionType,
  actions,
  setActions,
  isCreation,
}: IModal) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [date, setDate] = useState(new Date());

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
    else if (type === "lot_name") return errors.lot_name && jsxError;
    else if (type === "fish_number") return errors.fish_number && jsxError;
    else if (type === "average_weight")
      return errors.average_weight && jsxError;
  };

  async function onSubmit(data: any) {
    if (isCreation) {
      let newAction: IAction = {
        id: 0,
        type: actionType,
        date: date,
        pool: pools.find((p) => p.number === parseInt(data.pool_number))!,
      };

      switch (actionType) {
        case actionList[0]:
          newAction = {
            ...newAction,
            fish: fishes.find((f) => f.name === data.fish_name)!,
            totalWeight: parseFloat(data.total_weight),
            averageWeight: parseFloat(data.average_weight),
            fishNumber: parseInt(data.fish_number),
            lotName: data.lot_name,
          };
          break;
        case actionList[1]:
        case actionList[2]:
        case actionList[4]:
        case actionList[5]:
          newAction.totalWeight = parseFloat(data.total_weight);
          newAction.averageWeight = parseFloat(data.average_weight);
          newAction.fishNumber = parseInt(data.fish_number);
          break;
        case actionList[3]:
          newAction = {
            ...newAction,
            fish: fishes.find((f) => f.name === data.fish_name)!,
            totalWeight: parseFloat(data.total_weight),
            averageWeight: parseFloat(data.average_weight),
            fishNumber: parseInt(data.fish_number),
            lotName: data.lot_name,
            secondPool: data.new_pool,
          };
          break;
      }

      const dataFromServer: { action: IAction | null; error: string } =
        await postAction(newAction);

      if (dataFromServer.action) {
        toast.success("Action enregistrée");
        setActions([...actions, dataFromServer.action]);
      } else if (dataFromServer.error) toast.error(dataFromServer.error);
    } else {
      // ENCORE A ECRIRE
    }
    onClose();
  }

  const total_weight = watch("total_weight");
  const fish_number = watch("fish_number");
  useEffect(() => {
    if (total_weight && fish_number)
      setValue(
        "average_weight",
        Math.round((total_weight / fish_number) * 1000 * 100) / 100
      );
  }, [total_weight, fish_number]);

  let propsToDisplay: string[] = [];
  const index = actionList.indexOf(actionType);
  if (index >= 0) propsToDisplay = propsByActionType[index];

  const color = index >= 0 ? colors[index] : "white";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle
        className="entrance_modDial_title"
        style={{ "--color": color } as React.CSSProperties}
      >
        {actionType}
      </DialogTitle>
      <form
        id="entrance_form"
        onSubmit={handleSubmit(onSubmit)}
        className="entrance_modDial_container"
      >
        <Calendar date={date} setDate={setDate} />
        <div className="entrance_modDial_form">
          <div>
            <div className="entrance_modDial_grid">
              <div>{poolNumber} :</div>
              <select
                className="entrance_modial_select"
                {...register("pool_number", { required: true })}
                style={{ "--color": color } as React.CSSProperties}
              >
                {pools.map((pool) => (
                  <option key={pool.id}>{pool.number}</option>
                ))}
              </select>
            </div>
            {propsToDisplay.includes(fishSpecies) && (
              <div className="entrance_modDial_grid">
                <div>{fishSpecies} :</div>
                <select
                  className="entrance_modial_select"
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("fish_name", { required: true })}
                >
                  {fishes.map((fish) => (
                    <option key={fish.id}>{fish.name}</option>
                  ))}
                </select>
              </div>
            )}
            {propsToDisplay.includes(lotName) && (
              <div className="entrance_modDial_grid">
                <div>{lotName} :</div>
                <input
                  className="entrance_modial_select"
                  defaultValue={"Lot 1"}
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("lot_name", { required: true })}
                />
                {displayError("lot_name")}
              </div>
            )}
            {propsToDisplay.includes(totalWeight) && (
              <div className="entrance_modDial_grid">
                <div>{totalWeight} :</div>
                <input
                  className="entrance_modial_select"
                  placeholder="Masse totale(kg)"
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("total_weight", {
                    required: true,
                    min: 0,
                    max: 10000,
                    pattern: /^[0-9]+$/,
                  })}
                />
                {displayError("total_weight")}
              </div>
            )}
            {propsToDisplay.includes(fishNumber) && (
              <div className="entrance_modDial_grid">
                <div>{fishNumber} :</div>
                <input
                  className="entrance_modial_select"
                  placeholder="nb poissons"
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("fish_number", {
                    required: true,
                    min: 0,
                    max: 10000,
                    pattern: /^[0-9]+$/,
                  })}
                />
                {displayError("fish_number")}
              </div>
            )}
            {propsToDisplay.includes(averageWeight) && (
              <div className="entrance_modDial_grid">
                <div>{averageWeight} :</div>
                <input
                  className="entrance_modial_select"
                  placeholder="poids moyen"
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("average_weight", {
                    required: true,
                    min: 0,
                    max: 10000,
                  })}
                />
                {displayError("average_weight")}
              </div>
            )}
            {propsToDisplay.includes(newPool) && (
              <div className="entrance_modDial_grid">
                <div>{newPool} :</div>
                <select
                  className="entrance_modial_select"
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("new_pool", { required: true })}
                >
                  {pools.map((pool) => (
                    <option key={pool.id}>{pool.number}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <input
            className="entrance_modDial_button"
            type="submit"
            value="Valider"
            style={{ "--color": color } as React.CSSProperties}
          ></input>
        </div>
      </form>
    </Dialog>
  );
}
