import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import "./grid.css";

interface IGrid {
  col1: number[];
  col2: number[];
  col1Name: string;
  col2Name: string;
}

export default function Grid({ col1, col2, col1Name, col2Name }: IGrid) {
  const muiRows: GridRowsProp = col1.map((c1, index) => {
    return { id: index, col1: c1, col2: col2[index] };
  });

  const colHeaders: GridColDef[] = [
    {
      field: "col1",
      headerName: col1Name,
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderHeader(params) {
        return (
          <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
        );
      },
    },
    {
      field: "col2",
      headerName: col2Name,
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderHeader(params) {
        return (
          <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
        );
      },
    },
  ];

  return (
    <div style={{ height: 250, width: "310px" }}>
      <DataGrid
        rows={muiRows}
        columns={colHeaders}
        rowHeight={25}
        hideFooter={true}
        showColumnVerticalBorder={true}
        showCellVerticalBorder={true}
      />
    </div>
  );
}
