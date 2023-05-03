import { useEffect, useState } from "react";
import IPool from "../interfaces/pool";
import { IData, IComputedData } from "../interfaces/data";

function useDatas(selectedPool: IPool): IComputedData {
  let result: IComputedData = { error: "", data: null };

  return result;
}
