import { useMemo, useState } from "react";
import IPool from "../interfaces/pool";
import IAction from "../interfaces/action";
import { getFish, getFoodFromFish } from "../services/fish";
import { IComputedData } from "../interfaces/data";
import ComputePool from "../pages/Pools/computePool";

function useDatas(selectedPool: IPool | null): IComputedData {
  const [result, setResult] = useState<IComputedData>({
    error: "",
    data: null,
  });

  useMemo(() => {
    async function fetchDatas() {
      if (!selectedPool)
        return { error: "Aucun bassin sélectionné", data: null };

      const actionWithFishId = selectedPool.action!.find(
        (a: IAction) => a.fishId !== null
      );

      if (!actionWithFishId) {
        setResult({ error: "Aucun poisson associé au bassin", data: null });
        return;
      }

      const food = await getFoodFromFish(actionWithFishId.fishId!);
      if (!food || !food.food) {
        setResult({
          error: "Aucun aliment associé au poisson du bassin",
          data: null,
        });
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

      const compute = new ComputePool(
        selectedPool.action!,
        selectedPool.volume,
        food.food,
        fish.fish
      );
      const resComputation = compute.computeAllData();

      if (resComputation.data) {
        setResult({ error: "", data: resComputation.data });
      } else if (resComputation.error)
        setResult({ error: resComputation.error, data: null });
      else setResult({ error: "Erreur inconnue", data: null });
    }
    fetchDatas();
  }, [selectedPool]);

  return result;
}

export default useDatas;
