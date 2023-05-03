import usePools from "../../hooks/usePools";
import DailySheetGrid from "./dailySheetGrid";
import moment from "moment";
import "./dailySheet.css";

export default function DailySheet() {
  const pools = usePools();

  return (
    <div>
      <h1 className="dailySheet">
        Fiche Journalière du {moment(new Date()).format("DD/MM/YYY")}
      </h1>
      <div className="dailySheet">
        <DailySheetGrid date={new Date()} pools={pools} />
      </div>
    </div>
  );
}
