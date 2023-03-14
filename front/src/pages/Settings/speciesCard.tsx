import IFish from "../../interfaces/fish";
import Grid from "../../components/grid";
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
import "./speciesCard.css";

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

  return (
    <div className="species_card">
      <div className="species_card_title">
        <Chip label={fish.name} style={{ backgroundColor: "#fb9b50" }} />
        <i
          className="fa fa-pen species_card_modify_but"
          onClick={() => onEditClick(fish)}
        ></i>
      </div>
      <div className="species_card_body">
        <Grid
          col1={fish.weeks}
          col2={fish.weights}
          col1Name="Semaine"
          col2Name="Masse(g)"
        />
        <div style={{ width: "500px" }}>
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
}
