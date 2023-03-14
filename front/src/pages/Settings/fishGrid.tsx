import IFish from "../../interfaces/fish";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IFishGrid {
  fish: IFish;
  editable: boolean;
  onEditCell?: (fish: IFish) => void;
}

export default function FishGgrid({ fish, editable, onEditCell }: IFishGrid) {
  const muiRows: GridRowsProp = fish.weeks.map((w, i) => {
    return { id: i, week: w, weight: fish.weights[i] };
  });

  const colHeaders: GridColDef[] = [
    {
      field: "week",
      headerName: "Semaines",
      width: 85,
      sortable: false,
      disableColumnMenu: true,
      renderHeader(params: any) {
        return (
          <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
        );
      },
    },
    {
      field: "weight",
      headerName: "Poids (g)",
      width: 85,
      sortable: false,
      disableColumnMenu: true,
      renderHeader(params: any) {
        return (
          <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={muiRows}
      columns={colHeaders}
      rowHeight={25}
      hideFooter={true}
      processRowUpdate={(e: any) => {
        if (!editable || onEditCell === undefined) return;
        let newFish = { ...fish };
        newFish.weeks[e.id] = parseInt(e.from);
        newFish.weights[e.id] = parseInt(e.to);
        onEditCell(newFish);
      }}
    />
  );
}
