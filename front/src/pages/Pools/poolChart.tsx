import { IData } from "./computePool";
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
import "./poolChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IPoolChart {
  datas: IData[];
  dataType: string;
  setDataType: (dataType: string) => void;
}

export default function PoolChart({
  datas,
  dataType,
  setDataType,
}: IPoolChart) {
  const xLegend =
    dataType === "averageWeight" ? "Poids moyen (g)" : "Masse totale (kg)";

  const title =
    dataType === "averageWeight"
      ? "Évolution du poids moyen"
      : "Évolution de la masse totale";

  const data = {
    labels: datas.map((d) => d.dateFormatted),
    datasets: [
      {
        label: title,
        data: datas.map((d) => d[dataType as keyof IData]),
        borderColor: "rgb(50, 205, 50)",
        backgroundColor: "rgba(50, 205, 50, 0.5)",
        tension: 0.5,
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates",
        },
      },
      y: {
        title: {
          display: true,
          text: xLegend,
        },
      },
    },
  };

  return (
    <div>
      <select
        className="poolChart_dataType"
        value={dataType}
        onChange={(e) => setDataType(e.target.value)}
      >
        <option value="averageWeight">Poids moyen (g)</option>
        <option value="totalWeight">Masse totale (kg)</option>
      </select>
      <div>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
