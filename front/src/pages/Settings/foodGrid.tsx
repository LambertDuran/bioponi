import IFood from "../../interfaces/food";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IFoodGrid {
  food: IFood;
  editable: boolean;
}

export default function FoodGrid({ food, editable }: IFoodGrid) {
  const { froms, tos, ranges, sizes, foodRates, prices, foodTimeRates } = food;
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
  const colHeaders: GridColDef[] = [
    {
      field: "from",
      headerName: "De",
      width: 85,
      renderHeader,
      editable: editable,
    },
    {
      field: "to",
      headerName: "À",
      width: 85,
      renderHeader,
      editable: editable,
    },
    {
      field: "range",
      headerName: "Gamme de l'aliment",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderHeader,
      editable: editable,
    },
    {
      field: "size",
      headerName: "Taille(mm)",
      width: 90,
      renderHeader,
      editable: editable,
    },
    {
      field: "foodRate",
      headerName: "Taux de rationnement",
      width: 200,
      renderHeader,
      editable: editable,
    },
    {
      field: "price",
      headerName: "Prix(€/T)",
      width: 85,
      renderHeader,
      editable: editable,
    },
    {
      field: "foodTimeRate",
      headerName: "Distribution(g/min)",
      width: 200,
      renderHeader,
      editable: editable,
    },
  ];
  return (
    <DataGrid
      rows={muiRows}
      columns={colHeaders}
      rowHeight={25}
      hideFooter={true}
      showColumnVerticalBorder={true}
      showCellVerticalBorder={true}
    />
  );
}
