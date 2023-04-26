import IFood from "../../interfaces/food";
import FoodGrid from "./foodGrid";
import Chip from "@mui/material/Chip";
import "./foodCard.css";

interface IFoodCard {
  food: IFood;
  onEditClick: (food: IFood) => void;
  authorizeDelete: boolean;
  setOpenDelete: (open: boolean) => void;
}

export default function FoodCard({
  food,
  onEditClick,
  authorizeDelete,
  setOpenDelete,
}: IFoodCard) {
  return (
    <div className="foodCard">
      <div className="foodCard_title">
        <Chip label={food.name} style={{ backgroundColor: "#94a3c0" }} />
        <div>
          <i
            className="fa fa-pen foodCard_modify_but"
            onClick={() => onEditClick(food)}
          />
          {authorizeDelete && (
            <i
              className="fa fa-trash foodCard_modify_but"
              onClick={() => setOpenDelete(true)}
            />
          )}
        </div>
      </div>
      <div
        className="foodCard_body"
        style={{ height: `${90 + food.froms.length * 25}px` }}
      >
        <FoodGrid food={food} editable={false} />
      </div>
    </div>
  );
}
