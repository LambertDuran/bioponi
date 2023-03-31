import { useEffect, useState } from "react";
import { getAllPool } from "../../services/pool";
import { getFoodFromFish } from "../../services/fish";
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

  const dataGridStyle = {
    marginBottom: "5em",
    height: `${58 + (datas ? datas.length * 25 : 0)}px`,
  };

  const actionGridStyle = {
    marginBottom: "5em",
    height: `${
      58 +
      (selectedPool?.action?.length ? selectedPool?.action?.length * 25 : 0)
    }px`,
  };

  const acordionNames = [
    "Historique des actions",
    "Évolution du bassin",
    "Représentation graphique",
  ];

  const acordionChildren = [
    <div style={actionGridStyle}>
      {selectedPool && <ActionsGgrid actions={selectedPool.action!} />}
    </div>,
    <div style={dataGridStyle}>{datas && <PoolGrid datas={datas} />}</div>,
    <div className="pools_chart">
      {datas && (
        <PoolChart
          datas={datas}
          dataType={dataType}
          setDataType={setDataType}
        />
      )}
    </div>,
  ];

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
    async function getDatas() {
      if (!selectedPool) return;

      const actionWithFishId = selectedPool.action!.find(
        (a: IAction) => a.fishId !== null
      );

      if (!actionWithFishId) {
        toast.error("Impossible de récupérer l'aliment utilisé pour ce bassin");
        return;
      }
      const food = await getFoodFromFish(actionWithFishId.fishId!);
      if (!food || !food.food) {
        toast.error(food.error);
        return;
      }

      const compute = new ComputePool(
        selectedPool.action!,
        selectedPool.volume,
        food.food
      );

      const resComputation = compute.computeAllData();
      if (resComputation.error) toast.error(resComputation.error);
      else if (resComputation.data) setDatas(resComputation.data as IData[]);
      else toast.error("Erreur inconnue");
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
