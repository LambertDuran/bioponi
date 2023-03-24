import IPool from "./pool";
import IFish from "./fish";

export default interface IAction {
  type: string;
  date: Date;
  pool: IPool;
  fish: IFish;
  totalWeight: number;
  averageWeight: number;
  fishNumber: number;
  lotName: string;
  secondPool: IPool | null;
}
