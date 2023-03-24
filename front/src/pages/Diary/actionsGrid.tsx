import IAction from "../../interfaces/action";
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
}

export default function ActionsGgrid({ actions }: IActionGrid) {
  const muiRows: GridRowsProp = actions.map((a, i) => {
    return {
      id: i,
      action: a.type,
      date: moment(a.date).format("DD/MM/YYYY"),
      pool: a.pool.number,
      fish: a.fish.name,
      totalWeight: a.totalWeight,
      averageWeight: a.averageWeight,
      fishNumber: a.fishNumber,
      lotName: a.lotName,
      secondPool: a.secondPool ?? "",
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
      field: "action",
      headerName: "Action",
      flex: 1,
      renderHeader,
      cellClassName: (params: GridCellParams<any>) => {
        if (params.value === "Entrée du lot")
          return "actionsGrid_type_entrance";
        else if ((params.value = "Pesée")) return "actionsGrid_type_weight";
        else if ((params.value = "Vente")) return "actionsGrid_type_sale";
        else if ((params.value = "Transfert"))
          return "actionsGrid_type_transfer";
        else if ((params.value = "Sortie définitive"))
          return "actionsGrid_type_exit";
        else if ((params.value = "Mortalité")) return "actionsGrid_type_death";
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
      flex: 0.8,
      renderHeader,
    },
    {
      field: "averageWeight",
      headerName: "Masse moyenne (g)",
      flex: 0.8,
      renderHeader,
    },
    {
      field: "fishNumber",
      headerName: "Nombre de poissons",
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
