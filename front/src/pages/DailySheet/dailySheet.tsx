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
    <div>
      <div>
        <div className="dailySheet_calendar">
          <h1 className="dailySheet_title">
            Fiche Journalière du{" "}
            <div className="dailySheet_date">
              {moment(date).format("DD/MM/YYYY")}
            </div>
          </h1>
          <Calendar date={date} setDate={setDate} />
        </div>
      </div>
      <div className="dailySheet_grid">
        <DailySheetGrid date={date} pools={pools} />
      </div>
    </div>
  );
}
