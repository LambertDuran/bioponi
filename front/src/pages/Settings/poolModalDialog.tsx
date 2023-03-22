import Button from "../../components/button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import "./poolModalDialog.css";

interface IModal {
  title: string;
  open: boolean;
  onClose: () => void;
}

export default function PoolModalDialog({ title, open, onClose }: IModal) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>{title}</DialogTitle>
      <div className="poolModalDialog_container">
        <div className="poolModalDialog_grid">
          <p>N° bassin</p>
          <p>Volume</p>
        </div>
        <Button
          title="Nouveau Bassin"
          color="yellow"
          onClick={() => console.log("test")}
        />
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
