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

export default function SpeciesCard({ name, weeks, weights }: IFish) {
  const data = {
    labels: weeks.map((w) => w.toString()),
    datasets: [
      {
        label: `Croissance théorique de ${name}`,
        data: weights,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const options = { responsive: true };

  return (
    <div className="species_card">
      <div className="species_card_title">
        {<Chip label={name} style={{ backgroundColor: "#fb9b50" }}></Chip>}
      </div>
      <div className="species_card_body">
        <Grid
          col1={weeks}
          col2={weights}
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
