import { useEffect, useState } from "react";
import { getAllPool, getPool } from "../../services/pool";
import { getFish, getFoodFromFish } from "../../services/fish";
import IPool from "../../interfaces/pool";
import IAction from "../../interfaces/action";
import { IData, ComputePool } from "./computePool";
import PoolGrid from "./poolGrid";
import PoolChart from "./poolChart";
import ActionsGgrid from "../Diary/actionsGrid";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Collapse,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { orderBy } from "lodash";
import { colors } from "../../components/button";
import "./pools.css";

const useStyles = makeStyles((theme) => ({
  accordionRoot: {
    margin: "1em",
    borderRadius: "20px !important",
    "&.Mui-expanded": {
      marginLeft: "1em !important",
    },
  },
}));

export default function Pools() {
  const [pools, setPools] = useState<IPool[]>([]);
  const [selectedPool, setSelectedPool] = useState<IPool | null>(null);
  const [datas, setDatas] = useState<IData[] | null>(null);
  const [dataType, setDataType] = useState<string>("averageWeight");

  const classes = useStyles();

  const acordionNames = [
    "Historique des actions",
    "Évolution du bassin",
    "Représentation graphique",
  ];

  const acordionChildren = [
    <div
      style={{
        height: `${58 + selectedPool?.action?.length! * 25}px`,
      }}
    >
      {selectedPool && <ActionsGgrid actions={selectedPool.action!} />}
    </div>,
    <div
      style={{
        height: `${
          datas ? (datas?.length! < 100 ? 55 + datas?.length! * 26 : 2620) : 50
        }px`,
      }}
    >
      {datas && (
        <PoolGrid
          datas={datas}
          densityMin={selectedPool?.densityMin!}
          densityMax={selectedPool?.densityMax!}
        />
      )}
    </div>,
    <div className="pools_chart">
      {datas && (
        <PoolChart
          datas={datas}
          dataType={dataType}
          setDataType={setDataType}
          volume={selectedPool?.volume!}
          densityMin={selectedPool?.densityMin!}
          densityMax={selectedPool?.densityMax!}
        />
      )}
    </div>,
  ];

  useEffect(() => {
    async function getPools() {
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
    getPools();

    if (pools.length) setSelectedPool(pools[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pools.length) setSelectedPool(pools[0]);
  }, [pools]);

  useEffect(() => {
    async function getDatas() {
      if (!selectedPool) {
        setDatas(null);
        return;
      }

      const actionWithFishId = selectedPool.action!.find(
        (a: IAction) => a.fishId !== null
      );

      if (!actionWithFishId) {
        toast.error("Aucune donnée pour ce bassin");
        setSelectedPool(null);
        return;
      }
      const food = await getFoodFromFish(actionWithFishId.fishId!);
      if (!food || !food.food) {
        toast.error(food.error);
        return;
      }

      const fish = await getFish(actionWithFishId.fishId!);
      if (!fish || !fish.fish) {
        toast.error(fish.error);
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
        setDatas(resComputation.data as IData[]);
        return;
      } else if (resComputation.error) toast.error(resComputation.error);
      else toast.error("Erreur inconnue");
      setDatas(null);
    }

    getDatas();
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
        <div>
          {acordionNames.map((name, index) => (
            <Accordion
              TransitionComponent={Collapse}
              className={classes.accordionRoot}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{
                  backgroundColor: colors[index + 1],
                  borderRadius: "20px",
                }}
              >
                <Typography>{name}</Typography>
              </AccordionSummary>
              <AccordionDetails>{acordionChildren[index]}</AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    );
}
