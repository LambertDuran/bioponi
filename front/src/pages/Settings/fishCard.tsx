import IFish from "../../interfaces/fish";
import FishGgrid from "./fishGrid";
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
}

export default function SpeciesCard({ fish, onEditClick }: IFishCard) {
  const data = {
    labels: fish.weeks.map((w) => w.toString()),
    datasets: [
      {
        label: `Croissance théorique de ${fish.name}`,
        data: fish.weights,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const options = { responsive: true };

  const nbRow = 58 + fish.weeks.length * 25;
  const gridStyle = {
    padding: "0 1em 1em 0em",
    height: `${nbRow < 250 ? nbRow : 250}px`,
    width: "210px",
  };

  return (
    <div className="fish_card">
      <div className="fish_card_title">
        <Chip label={fish.name} style={{ backgroundColor: "#fb9b50" }} />
        <i
          className="fa fa-pen fish_card_modify_but"
          onClick={() => onEditClick(fish)}
        ></i>
      </div>
      <div className="fish_card_body">
        <div style={gridStyle}>
          <FishGgrid fish={fish} editable={false} />
        </div>
        <div style={{ width: "500px" }}>
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
}
