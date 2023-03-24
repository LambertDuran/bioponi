import IAction from "../../interfaces/action";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import moment from "moment";

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
