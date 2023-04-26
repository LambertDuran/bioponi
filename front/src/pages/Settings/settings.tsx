import { useEffect, useState } from "react";
// import useArray from "../../hooks/useArray";
import Button from "../../components/button";
import ItemList from "./itemList";
import FoodModalDialog from "./foodModalDialog";
import IFood from "../../interfaces/food";
import FoodCard from "./foodCard";
import { getAllFood, deleteFood } from "../../services/food";
import FishModalDialog from "./fishModalDialog";
import IFish from "../../interfaces/fish";
import SpeciesCard from "./fishCard";
import { getAllFish } from "../../services/fish";
import PoolModalDialog from "./poolModalDialog";
import RemoveModalDialog from "../../components/removeModalDialog";
import { toast } from "react-toastify";
import emptyList from "../../assets/emptyList.gif";
import "./settings.css";

const errorDefaultMsg = "Erreur de connexion au serveur distant.";
let errorMsg = errorDefaultMsg;

export default function Settings() {
  const [openFood, setOpenFood] = useState(false);
  const [openFish, setOpenFish] = useState(false);
  const [openPool, setOpenPool] = useState(false);
  const [isCreation, setIsCreation] = useState(true);

  const [selectedFood, setSelectedFood] = useState<IFood | null>(null);
  const [foods, setFoods] = useState<IFood[]>([]);

  const [selectedFish, setSelectedFish] = useState<IFish | null>(null);
  const [fishes, setFishes] = useState<IFish[]>([]);

  const [openDeleteFood, setOpenDeleteFood] = useState(false);

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

  const bAuthorizeFoodDelete = fishes.every(
    (fish) => fish.foodId !== selectedFood?.id
  );

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
    let isFoodsLoaded = false;
    let isFishesLoaded = false;

    async function getFoods() {
      const allFood = await getAllFood();
      if (allFood && allFood.food) {
        setFoods(allFood.food);
        isFoodsLoaded = true;
      } else if (allFood && allFood.error) errorMsg = allFood.error;
      else errorMsg = errorDefaultMsg;
    }

    async function getFishes() {
      const allFish = await getAllFish();
      if (allFish && allFish.fish) {
        setFishes(allFish.fish);
        isFishesLoaded = true;
      } else if (allFish && allFish.error) errorMsg = allFish.error;
      else errorMsg = errorDefaultMsg;
    }

    Promise.all([getFoods(), getFishes()]).then(() => {
      if (!isFoodsLoaded || !isFishesLoaded) toast.error(errorMsg);
    });
  }, []);

  useEffect(() => {
    if (selectedFish) {
      if (selectedFish.id !== 0) setSelectedFood(selectedFish.food);
      else setSelectedFood(null);
    }
  }, [selectedFish]);

  return (
    <div className="settings_container">
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

      <PoolModalDialog
        title={"Gestion des bassins :"}
        open={openPool}
        onClose={() => setOpenPool(false)}
      />

      <RemoveModalDialog
        open={openDeleteFood}
        onClose={() => setOpenDeleteFood(false)}
        data={selectedFood}
        datas={foods}
        setData={setSelectedFood}
        setDatas={setFoods}
        deleteData={deleteFood}
        message={`Voulez-vous vraiment supprimer l'aliment ${selectedFood?.name} ?`}
        successMessage={`L'aliment ${selectedFood?.name} a bien été supprimé.`}
      />

      <div className="bassin_button_container">
        <Button
          title="Gestion bassins"
          color="yellow"
          onClick={() => setOpenPool(true)}
        >
          <i className="fas fa-database"></i>
        </Button>
      </div>

      <div className="itemList_container" style={{ paddingTop: 0 }}>
        <ItemList
          title={"Espèces de poissons :"}
          items={fishes}
          selectedItem={selectedFish}
          setSelectedItem={setSelectedFish}
          color="#fb9b50"
        />
        {fishes.length === 0 && (
          <div className="nofish_container">
            <p>(Vous devez définir une espèce de poisson)</p>
            <img src={emptyList} alt="Vide" width={"75%"} />
          </div>
        )}
        {foods.length !== 0 && (
          <Button
            title="Nouvelle espèce"
            onClick={() => {
              setSelectedFish(iFish0);
              setIsCreation(true);
              setOpenFish(true);
            }}
            color="orange"
          >
            <i className="fas fa-fish"></i>
          </Button>
        )}
      </div>

      <div className="itemList_container" style={{ paddingTop: 0 }}>
        <ItemList
          title={"Aliments :"}
          items={foods}
          selectedItem={selectedFood}
          setSelectedItem={setSelectedFood}
          color="#7991bd"
        />
        <Button
          title="Nouvel aliment"
          onClick={() => {
            setSelectedFood(iFood0);
            setSelectedFish(null);
            setIsCreation(true);
            setOpenFood(true);
          }}
          color="blue"
        >
          <i className="fas fa-cheese"></i>
        </Button>
      </div>

      <div className="card_container">
        <div className="card_body_column">
          {selectedFish && selectedFish.id !== 0 && (
            <SpeciesCard
              fish={selectedFish}
              onEditClick={handleEditClickFish}
            />
          )}
        </div>
        <div className="card_body_column">
          {selectedFood && selectedFood.id !== 0 && (
            <FoodCard
              food={selectedFood}
              onEditClick={handleEditClickFood}
              setOpenDelete={setOpenDeleteFood}
              authorizeDelete={bAuthorizeFoodDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
