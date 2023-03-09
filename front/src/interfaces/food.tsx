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
