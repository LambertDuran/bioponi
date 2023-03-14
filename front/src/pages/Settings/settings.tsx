import { useEffect, useState } from "react";
// import useArray from "../../hooks/useArray";
import Button from "../../components/button";

import FoodModalDialog from "./foodModalDialog";
import IFood from "../../interfaces/food";
import FoodCard from "./foodCard";
import { getAllFood } from "../../services/food";

import FishModalDialog from "./fishModalDialog";
import IFish from "../../interfaces/fish";

import SpeciesCard from "./speciesCard";
import "./settings.css";

// const foods: IFood[] = [
//   {
//     title: "Aliment TAEC",
//     froms: [
//       10, 100, 150, 200, 400, 500, 1000, 1500, 1600, 1800, 2000, 2500, 3000,
//       3500, 4000, 5000,
//     ],
//     tos: [
//       100, 150, 200, 400, 500, 1000, 1500, 1600, 1800, 2000, 2500, 3000, 3500,
//       4000, 5000, 6000,
//     ],
//     ranges: Array(16).fill("NEO CDC CF 20"),
//     sizes: [
//       5.5, 5.5, 5.5, 5.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5,
//       7.5,
//     ],
//     foodRates: [
//       1.55, 1.55, 1.46, 1.33, 1.23, 1.12, 0.97, 0.97, 0.97, 0.97, 0.97, 0.97,
//       0.97, 0.97, 0.97, 0.97,
//     ],
//     prices: Array(16).fill(2100),
//     distributions: Array(16).fill(100),
//   },
// ];

const iFood0: IFood = {
  id: 0,
  name: "",
  froms: [10],
  tos: [100],
  ranges: ["NEO CDC CF 20"],
  sizes: [5.5],
  foodRates: [1.55],
  prices: [2100],
  distributions: [100],
};

const species: IFish[] = [
  {
    name: "TAEC",
    weeks: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 82, 86],
    weights: [
      5, 20, 30, 50, 90, 110, 150, 210, 330, 400, 550, 650, 750, 2000, 2400,
    ],
    id: 1,
    food: iFood0,
  },
  {
    name: "Saumon de fontaine",
    weeks: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 82, 86],
    weights: [
      7, 14, 28, 42, 56, 70, 84, 123, 162, 202, 360, 535, 672, 935, 1058,
    ],
    id: 2,
    food: iFood0,
  },
];

export default function Settings() {
  const [openFood, setOpenFood] = useState(false);
  const [openFish, setOpenFish] = useState(false);
  const [isCreation, setIsCreation] = useState(true);

  const [selectedFood, setSelectedFood] = useState<IFood>(iFood0);
  const [foods, setFoods] = useState<IFood[]>([]);

  const [selectedFish, setSelectedFish] = useState<IFish>(species[0]);
  const [fishes, setFishes] = useState<IFish[]>(species);

  // const { push } = useArray<IFood>(foods);

  const handleFoodModification = (newFood: IFood) => {
    if (isCreation) setFoods([...foods, newFood]);
    else {
      const newFoods = foods.map((food) =>
        food.id === newFood.id ? newFood : food
      );
      setFoods(newFoods);
    }
  };

  const handleEditClick = (food: IFood) => {
    setSelectedFood(food);
    setIsCreation(false);
    setOpenFood(true);
  };

  useEffect(() => {
    async function getFoods() {
      const allFood = await getAllFood();
      if (allFood && allFood.data) {
        setFoods(allFood.data);
      }
    }
    getFoods();
  }, []);

  return (
    <>
      {/* Dialogue pour l'ajout d'une nouvelle espèce d'aliment */}
      <FoodModalDialog
        title={
          isCreation
            ? "Création d'un nouvel aliment :"
            : "Modification d'un aliment :"
        }
        open={openFood}
        onClose={() => setOpenFood(false)}
        food={selectedFood}
        setFood={setSelectedFood}
        onFoodModification={handleFoodModification}
        isCreation={isCreation}
      />
      {/* Dialogue pour l'ajout d'une nouvelle espèce de poisson */}
      <FishModalDialog
        title={isCreation ? "Nouvelle espèce :" : "Modification d'espèce :"}
        open={openFish}
        onClose={() => setOpenFish(false)}
        fish={selectedFish}
        setFish={setSelectedFish}
        isCreation={isCreation}
      />
      {/* Créer une nouvelle espèce de poisson ou d'aliment*/}
      <div className="new_species_button">
        <Button
          title="Nouvelle espèce"
          onClick={() => {
            setSelectedFish(species[0]);
            setIsCreation(true);
            setOpenFish(true);
          }}
          children={<i className="fas fa-fish"></i>}
        />
        <Button
          title="Nouvel aliment"
          onClick={() => {
            setSelectedFood(iFood0);
            setIsCreation(true);
            setOpenFood(true);
          }}
          children={<i className="fas fa-cheese"></i>}
          color="blue"
        />
      </div>
      <div className="species">
        {/* Afficher les espèces de poissons*/}
        {/* {species.map(({ name, weeks, weights }) => (
          <div className="species_margin">
            <SpeciesCard name={name} weeks={weeks} weights={weights} />
          </div>
        ))} */}
        {/* Afficher les aliments */}
        {foods.map((f) => (
          <div className="species_margin">
            <FoodCard food={f} onEditClick={handleEditClick} />
          </div>
        ))}
      </div>
    </>
  );
}
