import { IData } from "./computePool";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IPoolGrid {
  datas: IData[];
}

export default function PoolGrid({ datas }: IPoolGrid) {
  const muiRows: GridRowsProp = datas.map((d, i) => {
    return {
      id: i,
      date: d.dateFormatted,
      averageWeight: d.averageWeight.toFixed(2),
      totalWeight: d.totalWeight.toFixed(2),
      fishNumber: d.fishNumber,
      lotName: d.lotName,
      actionType: d.actionType,
      actionWeight: d.actionWeight.toFixed(2),
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
    },
    {
      field: "action Weight",
      headerName: "Poids action(g)",
      flex: 1,
      renderHeader,
    },
    {
      field: "Quantité aliment (kg)",
      headerName: "",
      flex: 1,
      renderHeader,
    },
    {
      field: "density",
      headerName: "Densité(kg/m³)",
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
