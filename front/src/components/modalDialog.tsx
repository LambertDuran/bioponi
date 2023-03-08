import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

interface IModal {
  open: boolean;
  title: string;
  onClose: () => void;
}

export default function ModalDialog({ title, open, onClose }: IModal) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
    </Dialog>
  );
}
