import { useEffect, useState } from "react";
import IPool from "../../interfaces/pool";
import { getAllPool } from "../../services/pool";
import DailySheetGrid from "./dailySheetGrid";
import "./dailySheet.css";

export default function DailySheet() {
  const [pools, setPools] = useState<IPool[]>([]);

  useEffect(() => {
    const fetchPools = async () => {
      const res = await getAllPool();
      if (res && res.data) setPools(res.data);
    };
    fetchPools();
  }, []);

  return (
    <div>
      <h1>Fiche Journalière</h1>
      <div className="dailySheet">
        <DailySheetGrid date="" pools={pools} />
      </div>
    </div>
  );
}
