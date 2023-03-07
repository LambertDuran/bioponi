import "./speciesCard.css";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ISpeciesCard {
  title: string;
  weeks: number[];
  weights: number[];
}

export default function SpeciesCard({ title, weeks, weights }: ISpeciesCard) {
  const data = {
    labels: weeks.map((w) => w.toString()),
    datasets: [
      {
        label: `Croissance théorique de ${title}`,
        data: weights,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const options = { responsive: true };

  return (
    <div className="species_card">
      <h1 className="species_card_title">{title}</h1>
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
