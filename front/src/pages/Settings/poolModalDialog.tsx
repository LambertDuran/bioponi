import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { getAllPool } from "../../services/pool";
import IPool from "../../interfaces/pool";
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(() => {})}>
        <div className="poolModalDialog_container">
          <div className="poolModalDialog_grid">
            <p>N° bassin</p>
            <p>Volume</p>
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
                      min: 0,
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
                // setPools([...pools, { number: 1, volume: 0 }]);
              }}
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
          onClick={() => onClose()}
        ></input>
      </form>
    </Dialog>
  );
}
