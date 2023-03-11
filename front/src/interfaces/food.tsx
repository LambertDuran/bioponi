export default interface IFood {
  id: number;
  name: string;
  froms: number[];
  tos: number[];
  ranges: string[];
  sizes: number[];
  foodRates: number[];
  prices: number[];
  distributions: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

const removeRow = (food: IFood) => {
  food.froms.pop();
  food.tos.pop();
  food.ranges.pop();
  food.sizes.pop();
  food.foodRates.pop();
  food.prices.pop();
  food.distributions.pop();
  return food;
};

const addRow = (food: IFood) => {
  food.froms.push(food.tos.slice(-1)[0]);
  food.tos.push(food.tos.slice(-1)[0] + 100);
  food.ranges.push(food.ranges.slice(-1)[0]);
  food.sizes.push(food.sizes.slice(-1)[0]);
  food.foodRates.push(food.foodRates.slice(-1)[0]);
  food.prices.push(food.prices.slice(-1)[0]);
  food.distributions.push(food.distributions.slice(-1)[0]);
  return food;
};

export { addRow, removeRow };
