import IAction from "../../interfaces/action";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "../../components/button";
import { deleteAction } from "../../services/action";
import { toast } from "react-toastify";
import moment from "moment";
import "./removeModalDialog.css";

interface IRemoveModalDialog {
  open: boolean;
  onClose: () => void;
  action: IAction | null;
  actions: IAction[];
  setActions: (actions: IAction[]) => void;
}

export default function RemoveModalDialog({
  open,
  onClose,
  action,
  actions,
  setActions,
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
          onClick={async () => {
            const dataFromServer: { action: IAction | null; error: string } =
              await deleteAction(action!);
            if (dataFromServer.error) toast.error(dataFromServer.error);
            else {
              setActions(actions.filter((a) => a.id !== action?.id));
              toast.success("Action supprimée avec succès");
            }
            onClose();
          }}
        ></Button>
      </div>
    </Dialog>
  );
}
