import { useState } from "react";
import Button from "../../components/button";
import EntranceModalDialog from "./entranceModalDialog";
import "./diary.css";

const iEntrance = 0;
const iWeighing = 1;
const iSale = 2;
const iTransfer = 3;
const iExit = 4;
const iMortality = 5;

const actions = [
  "Entrée du lot",
  "Pesée",
  "Vente",
  "Transfert",
  "Sortie définitive",
  "Mortalité",
];
const colors = ["orange", "salmon", "yellow", "grey", "blue", "black"];
const titles = [
  "Entrée du lot",
  "Pesée",
  "Vente",
  "Transfert",
  "Sortie définitive",
  "Mortalité",
];

const icons = [
  "fas fa-sign-in-alt",
  "fas fa-weight",
  "fas fa-dollar-sign",
  "fas fa-exchange-alt",
  "fas fa-sign-out-alt",
  "fas fa-skull",
];

export default function Diary() {
  const [action, setAction] = useState("");
  return (
    <div className="diary_container">
      <div className="diary_but_container">
        {colors.map((color, index) => (
          <Button
            key={index}
            title={titles[index]}
            color={color}
            onClick={() => setAction(actions[index])}
            width={"13%"}
          >
            <i className={icons[index]}></i>
          </Button>
        ))}
      </div>
      <EntranceModalDialog
        open={action === actions[iEntrance]}
        title={actions[iEntrance]}
        onClose={() => setAction("")}
        isCreation={true}
      />
    </div>
  );
}
