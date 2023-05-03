import usePools from "../../hooks/usePools";
import DailySheetGrid from "./dailySheetGrid";
import Calendar from "../../components/calendar";
import { useState } from "react";
import moment from "moment";
import "./dailySheet.css";

export default function DailySheet() {
  const pools = usePools();
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="dailySheetContainer">
      <div>
        <Calendar date={date} setDate={setDate} />
      </div>
      <div className="dailySheet">
        <h1 className="dailySheet">
          Fiche Journalière du {moment(date).format("DD/MM/YYY")}
        </h1>
        <DailySheetGrid date={date} pools={pools} />
      </div>
    </div>
  );
}
