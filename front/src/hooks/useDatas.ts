import { useMemo, useState } from "react";
import IPool from "../interfaces/pool";
import IAction from "../interfaces/action";
import { getFish } from "../services/fish";
import { IComputedData } from "../interfaces/data";
import ComputePool from "../pages/Pools/computePool";
import { findLast } from "lodash";

// async function getComputer(selectedPool: IPool | null): ComputePool {}

function useDatas(selectedPool: IPool | null): IComputedData {
  const [result, setResult] = useState<IComputedData>({
    error: "",
    data: null,
  });

  useMemo(() => {
    async function fetchDatas() {
      if (!selectedPool)
        return { error: "Aucun bassin sélectionné", data: null };

      const actionWithFishId = findLast(
        selectedPool.action!,
        (a: IAction) => a.fishId !== null
      );

      if (!actionWithFishId) {
        setResult({ error: "Aucun poisson associé au bassin", data: null });
        return;
      }

      const fish = await getFish(actionWithFishId.fishId!);
      if (!fish || !fish.fish) {
        setResult({
          error: "Aucun poisson associé au bassin",
          data: null,
        });
        return;
      }

      if (!fish.fish.food) {
        setResult({
          error: "Aucun aliment associé au poisson du bassin",
          data: null,
        });
        return;
      }

      const computer = new ComputePool(
        selectedPool.action!,
        selectedPool.volume,
        fish.fish.food,
        fish.fish
      );

      setResult(computer.computeAllData());
    }
    fetchDatas();
  }, [selectedPool]);

  return result;
}

export default useDatas;
