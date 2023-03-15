import IFood from "../../interfaces/food";
import FoodGrid from "./foodGrid";
import Chip from "@mui/material/Chip";
import "./foodCard.css";

interface IFoodCard {
  food: IFood;
  onEditClick: (food: IFood) => void;
}

export default function FoodCard({ food, onEditClick }: IFoodCard) {
  return (
    <div className="foodCard">
      <div className="foodCard_title">
        <Chip label={food.name} style={{ backgroundColor: "#94a3c0" }} />
        <i
          className="fa fa-pen foodCard_modify_but"
          onClick={() => onEditClick(food)}
        ></i>
      </div>
      <div
        className="foodCard_body"
        style={{ height: `${58 + food.froms.length * 25}px` }}
      >
        <FoodGrid food={food} editable={false} />
      </div>
    </div>
  );
}
