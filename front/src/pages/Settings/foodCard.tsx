import IFood from "../../interfaces/food";
import FoodGrid from "./foodGrid";
import Chip from "@mui/material/Chip";
import "./foodCard.css";

interface IFoodCard {
  food: IFood;
}

export default function FoodCard({ food }: IFoodCard) {
  return (
    <div className="foodCard">
      <div className="foodCard_title">
        <Chip label={food.name} style={{ backgroundColor: "#94a3c0" }} />
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
