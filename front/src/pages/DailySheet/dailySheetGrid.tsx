import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import IPool from "../../interfaces/pool";
import { IData } from "../../interfaces/data";
import { getComputer } from "../../hooks/useDatas";
import ComputePool from "../Pools/computePool";
import { useEffect, useState } from "react";
import moment from "moment";
import { toInteger } from "lodash";

const errMsg = "";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IDailySheetGrid {
  pools: IPool[];
  date: Date;
}

export default function PoolGrid({ pools, date }: IDailySheetGrid) {
  const [computers, setComputers] = useState<ComputePool[]>([]);
  useEffect(() => {
    async function getComputers() {
      let newComputers = [];
      for (let i = 0; i < pools.length; i++) {
        const computer = await getComputer(pools[i]);
        if (computer) {
          computer.computeAllData();
          newComputers.push(computer);
        }
      }
      setComputers(newComputers);
    }
    getComputers();
  }, [pools]);

  let muiRows: GridRowsProp | null = null;
  if (computers.length)
    muiRows = pools.map((p, i) => {
      if (pools[i].action?.length === 0)
        return {
          id: i,
          numero: p.number,
          aliment: "",
          foodRate: "",
          foodWeight: "",
          time: "",
        };

      let data: IData | undefined = undefined;
      if (i < computers.length)
        data = computers[i].data.find(
          (d) => d.dateFormatted === moment(date).format("DD/MM/YYYY")
        );

      if (!data)
        return {
          id: i,
          numero: p.number,
          aliment: errMsg,
          foodRate: errMsg,
          foodWeight: errMsg,
          time: errMsg,
        };

      const foodRate = computers[i].getFoodRate(date);
      const foodWeight = computers[i].getFoodWeightForDate(
        date,
        data.totalWeight
      );
      const distributionRate = computers[i].getDistributionRate(date);
      const time = (foodWeight * 1000) / distributionRate;

      if (foodWeight == 0)
        return {
          id: i,
          numero: p.number,
          aliment: "",
          foodRate: "",
          foodWeight: "",
          time: "",
        };

      return {
        id: i,
        numero: p.number,
        aliment: computers[i].food?.name,
        foodRate: foodRate,
        foodWeight: foodWeight.toFixed(2),
        time:
          time.toFixed(0) +
          " min " +
          ((time - toInteger(time)) * 60).toFixed(0) +
          " sec",
      };
    });

  const colHeaders: GridColDef[] = [
    {
      field: "numero",
      headerName: "Bassin n°",
      flex: 1,
      renderHeader,
    },
    {
      field: "aliment",
      headerName: "Aliment",
      flex: 1,
      renderHeader,
    },
    {
      field: "foodRate",
      headerName: "Taux de rationnement",
      flex: 1,
      renderHeader,
    },
    {
      field: "foodWeight",
      headerName: "Quantité(kg)",
      flex: 1,
      renderHeader,
    },
    {
      field: "time",
      headerName: "Durée à programmer",
      flex: 1,
      renderHeader,
    },
  ];

  return (
    muiRows && (
      <DataGrid
        rows={muiRows}
        columns={colHeaders}
        rowHeight={25}
        autoHeight
        hideFooter
      />
    )
  );
}
