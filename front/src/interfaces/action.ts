import IPool from "./pool";
import IFish from "./fish";

export default interface IAction {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  type: string;
  date: Date;
  pool: IPool;
  poolId?: number;
  fish?: IFish;
  fishId?: number;
  totalWeight?: number;
  averageWeight?: number;
  fishNumber?: number;
  lotName?: string;
  secondPool?: IPool;
  secondPoolId?: number;
}
