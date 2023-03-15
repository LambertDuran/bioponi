import IFood from "./food";

export default interface IFish {
  id: number;
  name: string;
  weeks: number[];
  weights: number[];
  food: IFood;
  foodId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const removeRow = (fish: IFish) => {
  fish.weeks.pop();
  fish.weights.pop();
  return fish;
};

const addRow = (fish: IFish) => {
  fish.weeks.push(Math.round(fish.weeks.slice(-1)[0] * 15) / 10);
  fish.weights.push(Math.round(fish.weights.slice(-1)[0] * 15) / 10);
  return fish;
};

export { addRow, removeRow };
