import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

export default function BioponiCalendar() {
  const [date, setDate] = useState(new Date());

  return <Calendar onChange={setDate} value={date} locale="fr-FR" />;
}
