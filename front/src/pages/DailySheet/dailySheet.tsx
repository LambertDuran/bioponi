import usePools from "../../hooks/usePools";
import DailySheetGrid from "./dailySheetGrid";
import "./dailySheet.css";

export default function DailySheet() {
  const pools = usePools();

  return (
    <div>
      <h1>Fiche Journalière</h1>
      <div className="dailySheet">
        <DailySheetGrid date="" pools={pools} />
      </div>
    </div>
  );
}
