import { useEffect, useState } from "react";
import IPool from "../../interfaces/pool";
import { IData, IComputedData } from "../../interfaces/data";
import PoolGrid from "./poolGrid";
import PoolChart from "./poolChart";
import usePools from "../../hooks/usePools";
import useDatas from "../../hooks/useDatas";
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
  const pools: IPool[] = usePools();
  const [selectedPool, setSelectedPool] = useState<IPool | null>(null);
  const [dataType, setDataType] = useState<string>("averageWeight");
  const classes = useStyles();

  const computedData: IComputedData = useDatas(selectedPool);
  let datas: IData[] | null = null;
  if (computedData.data && !computedData.error)
    datas = computedData.data as IData[] | null;
  else if (computedData.error) toast.error(computedData.error);

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
    if (pools.length) setSelectedPool(pools[0]);
  }, [pools]);

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
