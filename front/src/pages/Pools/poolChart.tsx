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
import ChartDataLabels from "chartjs-plugin-datalabels";
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

ChartJS.register(ChartDataLabels);

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

  const deaths: number[] = [];
  const sells: number[] = [];
  const transfers: number[] = [];
  const weights: number[] = [];
  for (let i = 0; i < datas.length; i++) {
    switch (datas[i].actionType) {
      case "Mortalité":
        deaths.push(i);
        break;
      case "Vente":
        sells.push(i);
        break;
      case "Transfert":
        transfers.push(i);
        break;
      case "Pesée":
        weights.push(i);
    }
  }

  const data = {
    labels: datas.map((d) => d.dateFormatted),
    datasets: [
      {
        label: title,
        data: datas.map((d) =>
          d[dataType as keyof IData] > 0 ? d[dataType as keyof IData] : null
        ),
        datalabels: {
          align: "start",
          anchor: "start",
          color: "black",
        },
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
    plugins: {
      datalabels: {
        font: {
          family: "FontAwesome",
          size: 20,
        },
        formatter: function (value: any, context: any) {
          if (deaths.includes(context.dataIndex)) return "\uf54c";
          if (sells.includes(context.dataIndex)) return "\uf0d6";
          if (transfers.includes(context.dataIndex)) return "\uf0c1";
          if (weights.includes(context.dataIndex)) return "\uf24e";
          else return "";
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
        <Line options={options} data={data as any} />
      </div>
    </div>
  );
}
