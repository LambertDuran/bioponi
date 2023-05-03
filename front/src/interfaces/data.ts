interface IData {
  date: Date;
  dateFormatted: string;
  averageWeight: number;
  totalWeight: number;
  fishNumber: number;
  lotName: string;
  actionType: string;
  actionWeight: number;
  foodWeight: number;
  density: number;
}

interface IComputedData {
  error: string;
  data: IData | IData[] | null;
}

export type { IData, IComputedData };
