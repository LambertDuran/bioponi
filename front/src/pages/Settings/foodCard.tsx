import IFood from "../../interfaces/food";
import FoodGrid from "./foodGrid";
import "./foodCard.css";

interface IFoodCard {
  food: IFood;
}

export default function FoodCard({ food }: IFoodCard) {
  return (
    <div className="foodCard">
      <div className="foodCard_title">{food.title}</div>
      <div className="foodCard_body">
        <FoodGrid food={food} />
      </div>
    </div>
  );
}
