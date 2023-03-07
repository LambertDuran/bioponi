import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import "./foodCard.css";

export interface IFood {
  title: string;
  froms: number[];
  tos: number[];
  ranges: string[];
  sizes: number[];
  foodRates: number[];
  prices: number[];
  foodTimeRates: number[];
}

export default function FoodCard({
  title,
  froms,
  tos,
  ranges,
  sizes,
  foodRates,
  prices,
  foodTimeRates,
}: IFood) {
  const muiRows: GridRowsProp = froms.map((f, i) => {
    return {
      id: i,
      from: f,
      to: tos[i],
      range: ranges[i],
      size: sizes[i],
      foodRate: foodRates[i],
      price: prices[i],
      foodTimeRate: foodTimeRates[i],
    };
  });

  const renderHeader = (params: any) => (
    <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
  );

  const colHeaders: GridColDef[] = [
    {
      field: "from",
      headerName: "De",
      width: 85,
      renderHeader,
    },
    {
      field: "to",
      headerName: "À",
      width: 85,
      renderHeader,
    },
    {
      field: "range",
      headerName: "Gamme de l'aliment",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderHeader,
    },
    {
      field: "size",
      headerName: "Taille(mm)",
      width: 90,
      renderHeader,
    },
    {
      field: "foodRate",
      headerName: "Taux de rationnement",
      width: 200,
      renderHeader,
    },
    {
      field: "price",
      headerName: "Prix(€/T)",
      width: 85,
      renderHeader,
    },
    {
      field: "foodTimeRate",
      headerName: "Distribution(g/min)",
      width: 200,
      renderHeader,
    },
  ];

  return (
    <div className="foodCard">
      <div className="foodCard_title">{title}</div>
      <div className="foodCard_body">
        <DataGrid
          rows={muiRows}
          columns={colHeaders}
          rowHeight={25}
          hideFooter={true}
          showColumnVerticalBorder={true}
          showCellVerticalBorder={true}
        />
      </div>
    </div>
  );
}
