import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { getAllPool, postPool, putPool } from "../../services/pool";
import IPool from "../../interfaces/pool";
import { toast } from "react-toastify";
import "./poolModalDialog.css";

interface IModal {
  title: string;
  open: boolean;
  onClose: () => void;
}

export default function PoolModalDialog({ title, open, onClose }: IModal) {
  const [pools, setPools] = useState<IPool[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isNotValid = Object.keys(errors).length > 0;

  const displayErrors = () => {
    return Object.keys(errors).map((key) =>
      errors[key]!.type === "required" ? (
        <p key={key} className="poolModalDialog_error">
          Champs requis.
        </p>
      ) : errors[key]!.type === "min" ? (
        <p key={key} className="poolModalDialog_error">
          Valeur inférieure à 0.
        </p>
      ) : errors[key]!.type === "max" ? (
        <p key={key} className="poolModalDialog_error">
          Valeur supérieure à 100.
        </p>
      ) : errors[key]!.type === "pattern" ? (
        <p key={key} className="poolModalDialog_error">
          Valeur non numérique.
        </p>
      ) : (
        <p key={key} className="poolModalDialog_error">
          Erreur.
        </p>
      )
    );
  };

  useEffect(() => {
    const fetchPools = async () => {
      const res = await getAllPool();
      if (res && res.data) setPools(res.data);
    };
    fetchPools();
  }, []);

  async function onSubmit(data: any) {
    // 1. Update pools state with form values
    let newPools: IPool[] = [...pools];
    for (const key in data) {
      if (key.includes("number")) {
        const index = parseInt(key.replace(/\D/g, ""));
        const number = parseInt(data[key]);
        newPools[index].number = number;
      }
      if (key.includes("volume")) {
        const index = parseInt(key.replace(/\D/g, ""));
        const volume = parseInt(data[key]);
        newPools[index].volume = volume;
      }
    }
    setPools(newPools);

    // 2. Send pools to server
    const poolPromises = pools.map((p: IPool, i) => {
      if (p.id === 0) return postPool(p);
      else return putPool({ id: p.id, number: p.number, volume: p.volume });
    });
    const poolResponses = await Promise.all(poolPromises);
    poolResponses.map((res, i) => {
      const createOrModify = pools[i].id === 0 ? "créer" : "modifier";
      const createdOrModified = pools[i].id === 0 ? "créé" : "modifié";
      if (res.error) {
        toast.error(
          `Impossible de ${createOrModify} le bassin ${pools[i].number}, ${res.error}`
        );
      } else {
        if (pools[i].id === 0) {
          let newPools: IPool[] = [...pools];
          newPools[i] = res.pool;
          setPools(newPools);
        }
        toast.success(`Bassin ${pools[i].number} ${createdOrModified}`);
      }
      return 0;
    });

    // 3. Close modal
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <form id="pool_form" onSubmit={handleSubmit(onSubmit)}>
        <div className="poolModalDialog_container">
          <div className="poolModalDialog_grid">
            <p>N° bassin</p>
            <p>Volume (m³)</p>
            {pools.map((pool, i) => (
              <>
                <div className="poolModalDialog_div">
                  <input
                    className="poolModalDialog_input"
                    defaultValue={pool.number}
                    {...register(`number${i}`, {
                      required: true,
                      min: 1,
                      max: 100,
                      pattern: /^[0-9]+$/,
                    })}
                  />
                </div>
                <div className="poolModalDialog_div">
                  <input
                    className="poolModalDialog_input"
                    defaultValue={pool.volume}
                    {...register(`volume${i}`, {
                      required: true,
                      min: 1,
                      max: 100,
                      pattern: /^[0-9]+$/,
                    })}
                  ></input>
                </div>
              </>
            ))}
          </div>
          <div style={{ margin: "0.25em 0 0 1em" }}>
            <Button
              title="Nouveau Bassin"
              color="yellow"
              onClick={() => {
                const lastPool = pools.slice(-1)[0];
                setPools([
                  ...pools,
                  {
                    id: 0,
                    number: lastPool.number + 1,
                    volume: lastPool.volume,
                  },
                ]);
              }}
              form=""
            />
          </div>
        </div>
        {displayErrors()}
        <input
          className={
            isNotValid
              ? "poolModalDialog_button_inactive"
              : "poolModalDialog_button_active"
          }
          type="submit"
          value="Valider"
          disabled={isNotValid}
        />
      </form>
    </Dialog>
  );
}
