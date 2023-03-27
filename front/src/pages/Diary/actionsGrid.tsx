import IAction from "../../interfaces/action";
import { actionList } from "./diary";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import moment from "moment";
import "./actionsGrid.css";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IActionGrid {
  actions: IAction[];
  setAction: (action: IAction | null) => void;
}

export default function ActionsGgrid({ actions, setAction }: IActionGrid) {
  const muiRows: GridRowsProp = actions.map((a, i) => {
    return {
      id: a.id,
      action: a.type,
      date: moment(a.date).format("DD/MM/YYYY"),
      pool: a.pool.number,
      fish: a.fish?.name ?? "",
      totalWeight: a.totalWeight,
      averageWeight: a.averageWeight,
      fishNumber: a.fishNumber,
      lotName: a.lotName ?? "",
      secondPool: a.secondPool ?? "",
    };
  });

  const colHeaders: GridColDef[] = [
    {
      field: "Effacer",
      headerName: "Effacer",
      flex: 0.5,
      renderHeader,
      renderCell: (params: GridCellParams<any>) => (
        <i className="fas fa-trash actionsGrid_delete"></i>
      ),
    },
    {
      field: "Modifier",
      headerName: "Modifier",
      flex: 0.5,
      renderHeader,
      renderCell: (params: GridCellParams<any>) => (
        <i
          className="fas fa-edit actionsGrid_modify"
          onClick={() =>
            setAction(actions.find((a) => a.id === params.row.id)!)
          }
        ></i>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderHeader,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.75,
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
      field: "pool",
      headerName: "Bassin",
      flex: 0.5,
      renderHeader,
    },
    {
      field: "fish",
      headerName: "Poisson",
      flex: 0.5,
      renderHeader,
    },
    {
      field: "totalWeight",
      headerName: "Masse totale (kg)",
      flex: 1,
      renderHeader,
    },
    {
      field: "averageWeight",
      headerName: "Masse moyenne (g)",
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
      headerName: "Lot",
      flex: 0.5,
      renderHeader,
    },
    {
      field: "secondPool",
      headerName: "Bassin de transfert",
      flex: 1,
      renderHeader,
    },
  ];

  return (
    <DataGrid
      rows={muiRows}
      columns={colHeaders}
      rowHeight={25}
      hideFooter={true}
    />
  );
}
