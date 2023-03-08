import Button from "../../components/button";
import ModalDialog from "../../components/modalDialog";
import SpeciesCard, { ISpecies } from "./speciesCard";
import FoodCard, { IFood } from "./foodCard";
import "./settings.css";
import { useEffect } from "react";

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

const foods: IFood[] = [
  {
    title: "Aliment TAEC",
    froms: [
      10, 100, 150, 200, 400, 500, 1000, 1500, 1600, 1800, 2000, 2500, 3000,
      3500, 4000, 5000,
    ],
    tos: [
      100, 150, 200, 400, 500, 1000, 1500, 1600, 1800, 2000, 2500, 3000, 3500,
      4000, 5000, 6000,
    ],
    ranges: Array(16).fill("NEO CDC CF 20"),
    sizes: [
      5.5, 5.5, 5.5, 5.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5,
      7.5,
    ],
    foodRates: [
      1.55, 1.55, 1.46, 1.33, 1.23, 1.12, 0.97, 0.97, 0.97, 0.97, 0.97, 0.97,
      0.97, 0.97, 0.97, 0.97,
    ],
    prices: Array(16).fill(2100),
    foodTimeRates: Array(16).fill(100),
  },
];

export default function Settings() {
  // Gérer l'affichage du dialogu modal
  useEffect(() => {
    const modal = document.querySelector(".modal");
    document
      .querySelector(".open-modal")
      ?.addEventListener("click", function () {
        modal?.classList.add("show");
      });
    document
      .querySelector(".close-modal")
      ?.addEventListener("click", function () {
        modal?.classList.remove("show");
      });
  }, []);

  return (
    <>
      {/* Dialogue pour l'ajout d'une nouvelle espèce de poisson ou d'un aliment */}
      <ModalDialog title="Création d'un nouvel aliment" />
      {/* Créer une nouvelle espèce de poisson */}
      <div className="new_species_button">
        <Button
          title="Nouvelle espèce"
          onClick={() => console.log("clicked")}
          children={<i className="fas fa-fish"></i>}
        />
        <Button
          title="Nouvel aliment"
          onClick={() => console.log("clicked")}
          children={<i className="fas fa-fish"></i>}
          color="blue"
          isModal={true}
        />
      </div>
      <div className="species">
        {/* Afficher les espèces de poissons*/}
        {species.map(({ title, weeks, weights }) => (
          <div className="species_margin">
            <SpeciesCard title={title} weeks={weeks} weights={weights} />
          </div>
        ))}
        {/* Afficher les aliments */}
        {foods.map(
          ({
            title,
            froms,
            tos,
            ranges,
            sizes,
            foodRates,
            prices,
            foodTimeRates,
          }) => (
            <div className="species_margin">
              <FoodCard
                title={title}
                froms={froms}
                tos={tos}
                ranges={ranges}
                sizes={sizes}
                foodRates={foodRates}
                prices={prices}
                foodTimeRates={foodTimeRates}
              />
            </div>
          )
        )}
      </div>
    </>
  );
}
