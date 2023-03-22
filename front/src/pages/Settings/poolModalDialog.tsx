import { useState } from "react";
import Button from "../../components/button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import IPool from "../../interfaces/pool";
import "./poolModalDialog.css";

interface IModal {
  title: string;
  open: boolean;
  onClose: () => void;
}

export default function PoolModalDialog({ title, open, onClose }: IModal) {
  const [pools, setPools] = useState<IPool[]>([]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>{title}</DialogTitle>
      <div className="poolModalDialog_container">
        <div className="poolModalDialog_grid">
          <p>N° bassin</p>
          <p>Volume</p>
          {pools.map((pool) => (
            <>
              <div className="poolModalDialog_div">
                <input
                  className="poolModalDialog_input"
                  value={pool.number}
                ></input>
              </div>
              <div className="poolModalDialog_div">
                <input
                  className="poolModalDialog_input"
                  value={pool.volume}
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
              setPools([...pools, { number: 0, volume: 0 }]);
            }}
          />
        </div>
      </div>
      <div style={{ margin: "1em 0 1.5em 1.5em" }}>
        <Button
          title="Valider"
          color="yellow"
          onClick={() => console.log("test")}
          width="18%"
        />
      </div>
    </Dialog>
  );
}
