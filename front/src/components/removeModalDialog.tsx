import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "./button";
import { toast } from "react-toastify";

interface IRemoveModalDialog {
  open: boolean;
  onClose: () => void;
  data: any | null;
  datas: any[];
  setDatas: (datas: any[]) => void;
  deleteData: (id: number) => Promise<any>;
  message: string;
  successMessage: string;
}

export default function RemoveModalDialog({
  open,
  onClose,
  data,
  datas,
  setDatas,
  deleteData,
  message,
  successMessage,
}: IRemoveModalDialog) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="rm_action_moddial">
        <i className="fas fa-trash" style={{ marginRight: "1em" }}></i>
        Suppression
      </DialogTitle>
      <p style={{ margin: "0 1em 1em 1em" }}>{message}</p>
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
            if (data.id === 0) {
              setDatas(datas.filter((a) => a.id !== data?.id));
              toast.success(successMessage);
              onClose();
              return;
            }
            const dataFromServer: { data: any | null; error: string } =
              await deleteData(data.id!);
            if (dataFromServer.error) toast.error(dataFromServer.error);
            else {
              setDatas(datas.filter((a) => a.id !== data?.id));
              toast.success(successMessage);
            }
            onClose();
          }}
        ></Button>
      </div>
    </Dialog>
  );
}
