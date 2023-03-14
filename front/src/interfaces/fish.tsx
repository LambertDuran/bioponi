import IFood from "./food";

export default interface IFish {
  id: number;
  name: string;
  weeks: number[];
  weights: number[];
  food: IFood;
  createdAt?: Date;
  updatedAt?: Date;
}

const removeRow = (fish: IFish) => {
  fish.weeks.pop();
  fish.weights.pop();
  return fish;
};

const addRow = (fish: IFish) => {
  fish.weeks.push(fish.weights.slice(-1)[0]);
  fish.weights.push(fish.weights.slice(-1)[0] + 100);
  return fish;
};

export { addRow, removeRow };
