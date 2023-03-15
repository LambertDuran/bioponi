import { useEffect, useState } from "react";
// import useArray from "../../hooks/useArray";
import Button from "../../components/button";
import ItemList from "./itemList";
import FoodModalDialog from "./foodModalDialog";
import IFood from "../../interfaces/food";
import FoodCard from "./foodCard";
import { getAllFood } from "../../services/food";
import FishModalDialog from "./fishModalDialog";
import IFish from "../../interfaces/fish";
import SpeciesCard from "./fishCard";
import { getAllFish } from "../../services/fish";
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

// const species: IFish[] = [
//   {
//     name: "TAEC",
//     weeks: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 82, 86],
//     weights: [
//       5, 20, 30, 50, 90, 110, 150, 210, 330, 400, 550, 650, 750, 2000, 2400,
//     ],
//     id: 1,
//     food: iFood0,
//     foodId: 1,
//   },
//   {
//     name: "Saumon de fontaine",
//     weeks: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 82, 86],
//     weights: [
//       7, 14, 28, 42, 56, 70, 84, 123, 162, 202, 360, 535, 672, 935, 1058,
//     ],
//     id: 2,
//     food: iFood0,
//     foodId: 1,
//   },
// ];

export default function Settings() {
  const [openFood, setOpenFood] = useState(false);
  const [openFish, setOpenFish] = useState(false);
  const [isCreation, setIsCreation] = useState(true);

  const [selectedFood, setSelectedFood] = useState<IFood | null>(null);
  const [foods, setFoods] = useState<IFood[]>([]);

  const [selectedFish, setSelectedFish] = useState<IFish | null>(null);
  const [fishes, setFishes] = useState<IFish[]>([]);

  // const { push } = useArray<IFood>(foods);

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

  const iFish0: IFish = {
    id: 0,
    name: "",
    weeks: [4],
    weights: [5],
    food: foods.length ? foods[0] : iFood0,
    foodId: foods.length ? foods[0].id : 0,
  };

  const handleFoodModification = (newFood: IFood) => {
    if (isCreation) setFoods([...foods, newFood]);
    else {
      const newFoods = foods.map((food) =>
        food.id === newFood.id ? newFood : food
      );
      setFoods(newFoods);
    }
  };

  const handleFishModification = (newFish: IFish) => {
    if (isCreation) setFishes([...fishes, newFish]);
    else {
      const newFishes = fishes.map((fish) =>
        fish.id === newFish.id ? newFish : fish
      );
      setFishes(newFishes);
    }
  };

  const handleEditClickFood = (food: IFood) => {
    setSelectedFood(food);
    setIsCreation(false);
    setOpenFood(true);
  };

  const handleEditClickFish = (fish: IFish) => {
    setSelectedFish(fish);
    setIsCreation(false);
    setOpenFish(true);
  };

  useEffect(() => {
    async function getFoods() {
      const allFood = await getAllFood();
      if (allFood && allFood.data) setFoods(allFood.data);
    }
    getFoods();
  }, []);

  useEffect(() => {
    async function getFishes() {
      const allFish = await getAllFish();
      if (allFish && allFish.data) setFishes(allFish.data);
    }
    getFishes();
  }, []);

  useEffect(() => {
    if (selectedFish) setSelectedFood(selectedFish.food);
  }, [selectedFish]);

  return (
    <div className="settings_container">
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
        foods={foods}
        isCreation={isCreation}
        onFishModification={handleFishModification}
      />
      {/* Créer une nouvelle espèce de poisson ou d'aliment*/}
      {/* <div className="new_species_button">
        {foods.length && (
          <Button
            title="Nouvelle espèce"
            onClick={() => {
              setSelectedFish(iFish0);
              setSelectedFood(null);
              setIsCreation(true);
              setOpenFish(true);
            }}
            children={<i className="fas fa-fish"></i>}
          />
        )}
        <Button
          title="Nouvel aliment"
          onClick={() => {
            setSelectedFood(iFood0);
            setSelectedFish(null);
            setIsCreation(true);
            setOpenFood(true);
          }}
          children={<i className="fas fa-cheese"></i>}
          color="blue"
        />
      </div> */}
      {/* <div className="species"> */}
      <ItemList
        title={"Espèces de poissons :"}
        items={fishes}
        selectedItem={selectedFish}
        setSelectedItem={setSelectedFish}
        color="#fb9b50"
      />
      <ItemList
        title={"Aliments :"}
        items={foods}
        selectedItem={selectedFood}
        setSelectedItem={setSelectedFood}
        color="#7991bd"
      />
      {/* Afficher les espèces de poissons*/}
      {selectedFish && selectedFish.id && (
        <SpeciesCard fish={selectedFish} onEditClick={handleEditClickFish} />
      )}
      {/* Afficher les aliments */}
      {selectedFood && selectedFood.id && (
        <FoodCard food={selectedFood} onEditClick={handleEditClickFood} />
      )}
      {/* </div> */}
    </div>
  );
}
