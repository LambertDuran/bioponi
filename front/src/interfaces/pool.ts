import IAction from "./action";

export default interface IPool {
  id: number;
  number: number;
  volume: number;
  densityMin: number;
  densityMax: number;
  action?: IAction[];
  actionSecondPool?: IAction[];
}
