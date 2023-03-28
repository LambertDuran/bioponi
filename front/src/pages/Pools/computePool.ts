import IAction from "../../interfaces/action";

interface IData {
  date: Date;
  dateFormatted: string;
  averageWeight: number;
  totalWeight: number;
  fishNumber: number;
  lotNumber: string;
  actionType: string;
  actionWeight: number;
  foodWeight: number;
  density: number;
}

interface IComputedData {
  error: string;
  data: IData | IData[] | null;
}

export class ComputePool {
  actions: IAction[] = [];
  data: IData[] = [];

  constructor(actions: IAction[]) {
    this.actions = actions;
  }

  computeData(index: number): IComputedData {
    if (index < 1 || index > this.actions.length - 2)
      return {
        error: "Index out of range",
        data: null,
      };

    let date0 = this.actions[index].date;
    let date1 = this.actions[index + 1].date;

    return {
      error: "",
      data: null,
    };
  }

  computeAllData(): IComputedData {
    let computedData: IComputedData = {
      error: "",
      data: [],
    };

    for (let i = 0; i < this.actions.length - 1; i++) {
      let dataI = this.computeData(i);
      if (dataI.error === "" && dataI.data)
        (computedData.data as IData[])?.push(dataI.data as IData);
      else {
        computedData.error = dataI.error;
        break;
      }
    }

    return computedData;
  }
}
