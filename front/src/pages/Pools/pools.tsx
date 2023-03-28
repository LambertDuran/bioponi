import { useEffect, useState } from "react";
import { getAllPool } from "../../services/pool";
import IPool from "../../interfaces/pool";

export default function Pools() {
  const [pools, setPools] = useState<IPool[]>([]);
  useEffect(() => {
    async function getPools() {
      const allPool = await getAllPool();
      if (allPool && allPool.data) setPools(allPool.data);
    }
    getPools();
  }, []);
  return (
    <div>
      <h1>Aucune Donnée 🙄</h1>
    </div>
  );
}
