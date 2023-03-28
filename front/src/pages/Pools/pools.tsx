import { useEffect, useState } from "react";
import { getAllPool } from "../../services/pool";
import IPool from "../../interfaces/pool";
import { IData, ComputePool } from "./computePool";
import { toast } from "react-toastify";
import "./pools.css";
import PoolGrid from "./poolGrid";

export default function Pools() {
  const [pools, setPools] = useState<IPool[]>([]);
  const [selectedPool, setSelectedPool] = useState<IPool | null>(null);
  const [datas, setDatas] = useState<IData[] | null>(null);

  const gridStyle = {
    width: "97%",
    padding: "0 1em 2em 1em",
    marginTop: "1em",
    height: `${58 + (datas ? datas.length * 25 : 0)}px`,
  };

  useEffect(() => {
    async function getPools() {
      const allPool = await getAllPool();
      if (allPool && allPool.data) setPools(allPool.data);
    }
    getPools();
    if (pools.length) setSelectedPool(pools[0]);
  }, []);

  useEffect(() => {
    if (pools.length) setSelectedPool(pools[0]);
  }, [pools]);

  useEffect(() => {
    if (selectedPool) {
      const compute = new ComputePool(
        selectedPool.action!,
        selectedPool.volume
      );
      const resComputation = compute.computeAllData();
      if (resComputation.error) toast.error(resComputation.error);
      else if (resComputation.data) setDatas(resComputation.data as IData[]);
      else toast.error("Erreur inconnue");
    }
  }, [selectedPool]);

  if (!pools.length)
    return (
      <div className="action_modDial_emptyList">
        <p>
          ⚠️ Vous devez définir un <strong>bassin</strong> et une
          <strong> espèce de poissons</strong> dans la page
          <strong> PARAMETRAGE</strong>⚠️
        </p>
      </div>
    );
  else
    return (
      <div className="pools_container">
        <div className="pools">
          <div>Sélectionner un bassin : </div>
          <select
            onChange={(e) =>
              setSelectedPool(
                pools.find((p) => p.number === parseInt(e.target.value))!
              )
            }
          >
            {pools.map((pool) => (
              <option key={pool.id} value={pool.number}>
                {pool.number}
              </option>
            ))}
          </select>
        </div>
        <div style={gridStyle}>{datas && <PoolGrid datas={datas} />}</div>
      </div>
    );
}
