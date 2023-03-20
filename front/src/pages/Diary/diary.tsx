import Button from "../../components/button";
import "./diary.css";

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
  return (
    <div className="diary_container">
      <div className="diary_but_container">
        {colors.map((color, index) => (
          <Button
            key={index}
            title={titles[index]}
            color={color}
            onClick={() => console.log("click")}
            width={"13%"}
          >
            <i className={icons[index]}></i>
          </Button>
        ))}
      </div>
    </div>
  );
}
