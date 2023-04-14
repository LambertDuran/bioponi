import { IData } from "./computePool";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import { actionList } from "../Diary/diary";
import "./poolGrid.css";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IPoolGrid {
  datas: IData[];
  densityMin: number;
  densityMax: number;
}

export default function PoolGrid({ datas, densityMin, densityMax }: IPoolGrid) {
  const muiRows: GridRowsProp = datas.map((d, i) => {
    return {
      id: i,
      date: d.dateFormatted,
      averageWeight: d.averageWeight.toFixed(2),
      totalWeight: d.totalWeight.toFixed(2),
      fishNumber: d.fishNumber,
      lotName: d.lotName,
      actionType: d.actionType,
      actionWeight: d.actionWeight > 0 ? d.actionWeight.toFixed(2) : "",
      foodWeight: d.foodWeight.toFixed(2),
      density: d.density.toFixed(2),
    };
  });

  const colHeaders: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderHeader,
    },
    {
      field: "averageWeight",
      headerName: "Poids moyen(g)",
      flex: 1,
      renderHeader,
    },
    {
      field: "totalWeight",
      headerName: "Masse totale(kg)",
      flex: 1,
      renderHeader,
    },
    {
      field: "fishNumber",
      headerName: "Nb poissons",
      flex: 1,
      renderHeader,
    },
    {
      field: "lotName",
      headerName: "Nom du lot",
      flex: 1,
      renderHeader,
    },
    {
      field: "actionType",
      headerName: "Action",
      flex: 1,
      renderHeader,
      cellClassName: (params: GridCellParams<any>) => {
        if (params.value === actionList[0]) return "actionsGrid_type_entrance";
        else if (params.value === actionList[1])
          return "actionsGrid_type_weight";
        else if (params.value === actionList[2]) return "actionsGrid_type_sale";
        else if (params.value === actionList[3])
          return "actionsGrid_type_transfer";
        else if (params.value === actionList[4]) return "actionsGrid_type_exit";
        else if (params.value === actionList[5])
          return "actionsGrid_type_death";
        else return "";
      },
    },
    {
      field: "actionWeight",
      headerName: "Poids action(kg)",
      flex: 1,
      renderHeader,
    },
    {
      field: "foodWeight",
      headerName: "Quantité aliment (kg)",
      flex: 1,
      renderHeader,
    },
    {
      field: "density",
      headerName: "Densité(kg/m³)",
      flex: 1,
      renderHeader,
      cellClassName: (params: GridCellParams<any>) => {
        if (parseFloat(params.value as string) < densityMin)
          return "pool_densityMin";
        else if (parseFloat(params.value as string) > densityMax)
          return "pool_densityMax";
        else return "";
      },
    },
  ];

  return (
    <DataGrid rows={muiRows} columns={colHeaders} rowHeight={25} autoHeight />
  );
}
