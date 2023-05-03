import { useMemo, useState } from "react";
import IPool from "../interfaces/pool";
import IAction from "../interfaces/action";
import { getFish } from "../services/fish";
import { IComputedData } from "../interfaces/data";
import ComputePool from "../pages/Pools/computePool";
import { findLast } from "lodash";

async function getComputer(
  selectedPool: IPool | null,
  setResult?: (res: IComputedData) => void
): Promise<ComputePool | null | undefined> {
  if (!selectedPool) return null;

  const actionWithFishId = findLast(
    selectedPool.action!,
    (a: IAction) => a.fishId !== null
  );

  if (!actionWithFishId) {
    if (setResult)
      setResult({ error: "Aucun poisson associé au bassin", data: null });
    return null;
  }

  const fish = await getFish(actionWithFishId.fishId!);
  if (!fish || !fish.fish) {
    if (setResult)
      setResult({
        error: "Aucun poisson associé au bassin",
        data: null,
      });
    return null;
  }

  if (!fish.fish.food) {
    if (setResult)
      setResult({
        error: "Aucun aliment associé au poisson du bassin",
        data: null,
      });
    return null;
  }

  return new ComputePool(
    selectedPool.action!,
    selectedPool.volume,
    fish.fish.food,
    fish.fish
  );
}

function useDatas(selectedPool: IPool | null): IComputedData {
  const [result, setResult] = useState<IComputedData>({
    error: "",
    data: null,
  });

  useMemo(() => {
    async function fetchDatas() {
      const computer: ComputePool | null | undefined = await getComputer(
        selectedPool,
        setResult
      );

      if (computer) setResult(computer.computeAllData());
    }
    fetchDatas();
  }, [selectedPool]);

  return result;
}

export default useDatas;
