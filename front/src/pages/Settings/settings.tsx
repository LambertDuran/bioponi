import Button from "../../components/button";
import Grid from "../../components/grid";

const weeks: number[] = [
  4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 82, 86,
];

const weights: number[] = [
  5, 20, 30, 50, 90, 110, 150, 210, 330, 400, 550, 650, 750, 2000, 2400,
];

export default function Settings() {
  return (
    <div style={{ height: 300, width: "320px" }}>
      <Grid
        col1={weeks}
        col2={weights}
        col1Name="Semaine"
        col2Name="Masse(g)"
      />
      <Button
        title="Nouvelle espèce"
        onClick={() => console.log("clicked")}
        children={<i className="fas fa-fish"></i>}
      ></Button>
    </div>
  );
}
