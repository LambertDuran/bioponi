import IFood from "../../interfaces/food";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const renderHeader = (params: any) => (
  <strong className="colHeaderGrid">{params.colDef.headerName}</strong>
);

interface IFoodGrid {
  food: IFood;
  editable: boolean;
  onEditCell?: (food: IFood) => void;
}

export default function FoodGrid({ food, editable, onEditCell }: IFoodGrid) {
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
      processRowUpdate={(e: any) => {
        if (onEditCell === undefined) return;
        let newFood = { ...food };
        newFood.froms[e.id] = parseInt(e.from);
        newFood.tos[e.id] = parseInt(e.to);
        newFood.ranges[e.id] = e.range;
        newFood.sizes[e.id] = parseFloat(e.size);
        newFood.foodRates[e.id] = parseFloat(e.foodRate);
        newFood.prices[e.id] = parseInt(e.price);
        newFood.foodTimeRates[e.id] = parseInt(e.foodTimeRate);
        onEditCell(newFood!);
        return newFood;
      }}
    />
  );
}
