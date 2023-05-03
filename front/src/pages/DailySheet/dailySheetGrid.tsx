import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import IPool from "../../interfaces/pool";
import useDatas from "../../hooks/useDatas";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IDailySheetGrid {
  pools: IPool[];
  date: string;
}

export default function PoolGrid({ pools, date }: IDailySheetGrid) {
  const muiRows: GridRowsProp = pools.map((p, i) => {
    return {
      id: i,
      numero: p.number,
      aliment: "aliment",
      foodRate: "foodRate",
      foodWeight: "foodWeight",
      time: "time",
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
    <DataGrid rows={muiRows} columns={colHeaders} rowHeight={25} autoHeight />
  );
}
