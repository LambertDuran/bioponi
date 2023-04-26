import IFish from "../../interfaces/fish";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Chip from "@mui/material/Chip";
import "./fishCard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IFishCard {
  fish: IFish;
  onEditClick: (fish: IFish) => void;
  setOpenDelete: (open: boolean) => void;
  authorizeDelete: boolean;
}

export default function SpeciesCard({
  fish,
  onEditClick,
  setOpenDelete,
  authorizeDelete,
}: IFishCard) {
  const data = {
    labels: fish.weeks.map((w) => w.toString()),
    datasets: [
      {
        label: `Croissance théorique de ${fish.name}`,
        data: fish.weights,
        borderColor: "rgb(50, 205, 50)",
        backgroundColor: "rgba(50, 205, 50, 0.5)",
        tension: 0.5,
      },
    ],
  };
  const options = { responsive: true };

  return (
    <div className="fish_card">
      <div className="fish_card_title">
        <Chip label={fish.name} style={{ backgroundColor: "#fb9b50" }} />
        <div>
          <i
            className="fa fa-pen fish_card_modify_but"
            onClick={() => onEditClick(fish)}
          />
          {authorizeDelete && (
            <i
              className="fa fa-trash fish_card_modify_but"
              onClick={() => setOpenDelete(true)}
            />
          )}
        </div>
      </div>
      <div className="fish_card_curve">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
