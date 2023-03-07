import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

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
    { field: "col1", headerName: col1Name, width: 150 },
    { field: "col2", headerName: col2Name, width: 150 },
  ];

  return (
    <div style={{ height: 300, width: "320px" }}>
      <DataGrid
        rows={muiRows}
        columns={colHeaders}
        rowHeight={25}
        hideFooter={true}
      />
    </div>
  );
}
