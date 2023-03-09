export default interface IFood {
  id: number;
  title: string;
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
