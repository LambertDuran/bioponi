import "./speciesCard.css";
import Grid from "../../components/grid";

interface ISpeciesCard {
  title: string;
  weeks: number[];
  weights: number[];
}

export default function SpeciesCard({ title, weeks, weights }: ISpeciesCard) {
  return (
    <div className="species_card">
      <h1 className="species_card_title">{title}</h1>
      <div className="species_card_body">
        <Grid
          col1={weeks}
          col2={weights}
          col1Name="Semaine"
          col2Name="Masse(g)"
        />
      </div>
    </div>
  );
}
