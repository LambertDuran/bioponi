import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

interface ICalendar {
  setDate: (date: Date) => void;
  date: Date;
}

export default function BioponiCalendar({ date, setDate }: ICalendar) {
  return <Calendar onChange={setDate} value={date} locale="fr-FR" />;
}
