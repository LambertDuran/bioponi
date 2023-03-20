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
            width={"20%"}
          ></Button>
        ))}
      </div>
    </div>
  );
}
