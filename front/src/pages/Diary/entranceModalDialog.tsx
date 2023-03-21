import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
  // food: IFood | null;
  // setFood: (food: IFood) => void;
  // onFoodModification: (food: IFood) => void;
  isCreation: boolean;
}

export default function EntranceModalDialog({
  open,
  title,
  onClose,
  // food,
  // setFood,
  // onFoodModification,
  isCreation,
}: IModal) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth={true}>
      <DialogTitle>{title}</DialogTitle>
    </Dialog>
  );
}
