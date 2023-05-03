import { useEffect, useState } from "react";
import { getAllPool, getPool } from "../services/pool";
import { orderBy } from "lodash";

function usePools() {
  const [pools, setPools] = useState([]);

  useEffect(() => {
    async function fetchPools() {
      const allPool = await getAllPool();
      if (!allPool || !allPool.data) return;

      let fetchedPools = allPool.data;
      fetchedPools.forEach((p: any) => {
        p.action! = orderBy(p.action!, ["date"], ["asc"]);
      });

      // Ajouter les actions de transferts dans la liste des actions
      // du bassin de destination
      for (let i = 0; i < fetchedPools.length; i++) {
        for (let action of fetchedPools[i].action!) {
          if (!action.secondPoolId) continue;

          const secondPool = await getPool(action.secondPoolId);
          if (!secondPool || !secondPool.data || secondPool.status !== 200)
            continue;
          action.secondPool = secondPool.data;

          const secondPoolIndex = fetchedPools.findIndex(
            (p: any) => p.id === action.secondPoolId
          );
          if (secondPoolIndex < 0) continue;

          fetchedPools[secondPoolIndex].action = fetchedPools[
            secondPoolIndex
          ].action.concat({ ...action, secondPool: null, secondPoolId: null });
        }
      }

      setPools(fetchedPools);
    }
    fetchPools();
  }, []);

  return pools;
}

export default usePools;
