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
import Chip from "@mui/material/Chip";
import { toast } from "react-toastify";
import "./actionModalDialog.css";

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
  [poolNumber, lotName, totalWeight, fishNumber, averageWeight, newPool],
  [poolNumber, totalWeight, fishNumber, averageWeight],
  [poolNumber, totalWeight, fishNumber, averageWeight],
];

const computeMethods = [
  "Masse tot ET Nb poissons",
  "Masse tot ET Poids moyen",
  "Nb poissons ET Poids moyen",
];

const computeMethodsJSX = [
  <p>
    M<sub>tot</sub> + N<sub>poisssons</sub>
  </p>,
  <p>
    M<sub>tot</sub> + P<sub>moy</sub>
  </p>,
  <p>
    N<sub>poisssons</sub> + P<sub>moy</sub>
  </p>,
];

interface IModal {
  open: boolean;
  onClose: () => void;
  fishes: IFish[];
  pools: IPool[];
  actionType: string;
  action: IAction | null;
  actions: IAction[];
  setActions: (actions: IAction[]) => void;
  isCreation: boolean;
}

export default function ActionModalDialog({
  open,
  onClose,
  fishes,
  pools,
  actionType,
  action,
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
  const [computeMethode, setComputeMethode] = useState("");

  useEffect(() => {
    if (action) {
      setValue("pool_number", action.pool.number);
      setValue("lot_name", action.lotName);
      setValue("total_weight", action.totalWeight);
      setValue("fish_number", action.fishNumber);
      setValue("average_weight", action.averageWeight);
      setValue("fish_name", action.fish?.name);
      setValue("new_pool", action.secondPool?.number);
      setDate(new Date(action.date));
    }
  }, [action]);

  const average_weight = watch("average_weight");
  const total_weight = watch("total_weight");
  const fish_number = watch("fish_number");

  useEffect(() => {
    if (!total_weight) return;
    if (computeMethode === "Masse tot ET Nb poissons" && fishNumber)
      setValue(
        "average_weight",
        ((total_weight / fish_number) * 1000).toFixed(2)
      );
    else if (computeMethode === "Masse tot ET Poids moyen" && averageWeight)
      setValue(
        "fish_number",
        Math.round((total_weight / average_weight) * 1000)
      );
  }, [total_weight]);

  useEffect(() => {
    if (!fish_number) return;
    if (computeMethode === "Nb poissons ET Poids moyen" && averageWeight)
      setValue(
        "total_weight",
        ((fish_number * average_weight) / 1000).toFixed(2)
      );
    else if (computeMethode === "Masse tot ET Nb poissons" && total_weight)
      setValue(
        "average_weight",
        ((total_weight / fish_number) * 1000).toFixed(2)
      );
  }, [fish_number]);

  useEffect(() => {
    if (!average_weight) return;
    if (computeMethode === "Masse tot ET Poids moyen" && total_weight)
      setValue(
        "fish_number",
        Math.round((total_weight / average_weight) * 1000)
      );
    else if (computeMethode === "Nb poissons ET Poids moyen" && fish_number)
      setValue(
        "total_weight",
        ((fish_number * average_weight) / 1000).toFixed(2)
      );
  }, [average_weight]);

  const displayError = (type: string) => {
    const jsxError = (
      <>
        <div></div>
        <div className="action_modDial_error">Format ou valeur incorrecte</div>
      </>
    );
    if (type === "total_weight") return errors.total_weight && jsxError;
    else if (type === "lot_name") return errors.lot_name && jsxError;
    else if (type === "fish_number") return errors.fish_number && jsxError;
    else if (type === "average_weight")
      return errors.average_weight && jsxError;
  };

  async function onSubmit(data: any) {
    let newAction: IAction = {
      id: isCreation ? 0 : action!.id,
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
          secondPool: pools.find((p) => p.number === parseInt(data.new_pool))!,
        };
        break;
    }

    let dataFromServer: { action: IAction | null; error: string };
    if (isCreation) dataFromServer = await postAction(newAction);
    else dataFromServer = await putAction(newAction);

    if (dataFromServer.action) {
      if (isCreation) {
        toast.success("Action enregistrée");
        setActions([...actions, dataFromServer.action]);
      } else {
        toast.success("Action modifiée");
        setActions(actions.map((a) => (a.id === newAction.id ? newAction : a)));
      }
    } else if (dataFromServer.error) toast.error(dataFromServer.error);

    onClose();
  }

  let propsToDisplay: string[] = [];
  const index = actionList.indexOf(actionType);
  if (index >= 0) propsToDisplay = propsByActionType[index];
  const color = index >= 0 ? colors[index] : "white";

  const unselectedItemStyle = {
    border: `2px solid ${color}`,
    cursor: "pointer",
    margin: "1em 0 1em 1em",
    backgroundColor: "transparent",
    top: "0px",
  };
  const selectedItemStyle = {
    backgroundColor: `${color}`,
    cursor: "pointer",
    margin: "1em 0 1em 1em",
    border: "1px solid black",
    fontWeight: "bold",
    top: 0,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle
        className="action_modDial_title"
        style={{ "--color": color } as React.CSSProperties}
      >
        {actionType}
      </DialogTitle>
      <form
        id="action_form"
        onSubmit={handleSubmit(onSubmit)}
        className="action_modDial_container"
      >
        <Calendar date={date} setDate={setDate} />
        <div className="action_modDial_form">
          <div>
            <div className="action_modDial_grid">
              <div>{poolNumber} :</div>
              <select
                className="action_modial_select"
                {...register("pool_number", { required: true })}
                style={{ "--color": color } as React.CSSProperties}
              >
                {pools.map((pool) => (
                  <option key={pool.id}>{pool.number}</option>
                ))}
              </select>
            </div>
            {propsToDisplay.includes(fishSpecies) && (
              <div className="action_modDial_grid">
                <div>{fishSpecies} :</div>
                <select
                  className="action_modial_select"
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
              <div className="action_modDial_grid">
                <div>{lotName} :</div>
                <input
                  className="action_modial_select"
                  defaultValue={"Lot 1"}
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("lot_name", { required: true })}
                />
                {displayError("lot_name")}
              </div>
            )}
            <div>Méthode de saisie du poids :</div>
            {computeMethods.map((m: string, i) => (
              <Chip
                key={m}
                label={computeMethodsJSX[i]}
                onClick={() => setComputeMethode(m)}
                style={
                  m === computeMethode ? selectedItemStyle : unselectedItemStyle
                }
              />
            ))}
            {propsToDisplay.includes(totalWeight) && (
              <div className="action_modDial_grid">
                <div>{totalWeight} :</div>
                <input
                  className="action_modial_select"
                  placeholder="Masse totale(kg)"
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("total_weight", {
                    required: true,
                    min: 0,
                    max: 10000,
                    pattern: /^[0-9]+(\.[0-9]+)?$/,
                  })}
                />
                {displayError("total_weight")}
              </div>
            )}
            {propsToDisplay.includes(fishNumber) && (
              <div className="action_modDial_grid">
                <div>{fishNumber} :</div>
                <input
                  className="action_modial_select"
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
              <div className="action_modDial_grid">
                <div>{averageWeight} :</div>
                <input
                  className="action_modial_select"
                  placeholder="poids moyen"
                  style={{ "--color": color } as React.CSSProperties}
                  {...register("average_weight", {
                    required: true,
                    min: 0,
                    max: 10000,
                    pattern: /^[0-9]+(\.[0-9]+)?$/,
                  })}
                />
                {displayError("average_weight")}
              </div>
            )}
            {propsToDisplay.includes(newPool) && (
              <div className="action_modDial_grid">
                <div>{newPool} :</div>
                <select
                  className="action_modial_select"
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
            className="action_modDial_button"
            type="submit"
            value="Valider"
            style={
              {
                "--color": color,
                color: actionType === "Mortalité" ? "white" : "black",
              } as React.CSSProperties
            }
          ></input>
        </div>
      </form>
    </Dialog>
  );
}
