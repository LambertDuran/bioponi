import IAction from "../../interfaces/action";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "../../components/button";
import moment from "moment";
import "./removeModalDialog.css";

interface IRemoveModalDialog {
  open: boolean;
  onClose: () => void;
  action: IAction | null;
}

export default function RemoveModalDialog({
  open,
  onClose,
  action,
}: IRemoveModalDialog) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="rm_action_moddial">
        <i className="fas fa-trash" style={{ marginRight: "1em" }}></i>
        Suppression
      </DialogTitle>
      <p style={{ margin: "0 1em 1em 1em" }}>
        {`Êtes-vous sûrs de vouloir supprimer cette action "${
          action?.type
        }" du ${moment(action?.date).format("DD/MM/YYYY")} ?`}
      </p>
      <div className="rm_action_moddial_butContainer">
        <div style={{ marginRight: "1em" }}>
          <Button
            title="Annuler"
            color="black"
            onClick={() => onClose()}
          ></Button>
        </div>
        <Button
          title="Supprimer"
          color="red"
          onClick={() => onClose()}
        ></Button>
      </div>
    </Dialog>
  );
}
