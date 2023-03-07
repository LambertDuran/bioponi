import Button from "../../components/button";
import SpeciesCard from "./speciesCard";
import "./settings.css";

interface ISpecies {
  title: string;
  weeks: number[];
  weights: number[];
}

const species: ISpecies[] = [
  {
    title: "TAEC",
    weeks: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 82, 86],
    weights: [
      5, 20, 30, 50, 90, 110, 150, 210, 330, 400, 550, 650, 750, 2000, 2400,
    ],
  },
  {
    title: "Saumon de fontaine",
    weeks: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 82, 86],
    weights: [
      7, 14, 28, 42, 56, 70, 84, 123, 162, 202, 360, 535, 672, 935, 1058,
    ],
  },
];

export default function Settings() {
  return (
    <>
      <div className="species">
        {species.map((s) => (
          <div className="species_margin">
            <SpeciesCard title={s.title} weeks={s.weeks} weights={s.weights} />
          </div>
        ))}
      </div>
      <div className="new_species_button">
        <Button
          title="Nouvelle espèce"
          onClick={() => console.log("clicked")}
          children={<i className="fas fa-fish"></i>}
        />
      </div>
    </>
  );
}
