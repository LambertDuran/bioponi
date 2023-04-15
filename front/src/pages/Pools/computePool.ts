import IAction from "../../interfaces/action";
import Food from "../../interfaces/food";
import IFish from "../../interfaces/fish";
import moment from "moment";
import { orderBy } from "lodash";

export interface IData {
  date: Date;
  dateFormatted: string;
  averageWeight: number;
  totalWeight: number;
  fishNumber: number;
  lotName: string;
  actionType: string;
  actionWeight: number;
  foodWeight: number;
  density: number;
}

interface IComputedData {
  error: string;
  data: IData | IData[] | null;
}

export class ComputePool {
  actions: IAction[] = [];
  data: IData[] = [];
  poolVolume: number = 0;
  food: Food | null = null;
  fish: IFish | null = null;
  nbDaysOfExtrapolation = 100;

  constructor(actions: IAction[], poolVolume: number, food: Food, fish: IFish) {
    this.actions = orderBy(actions, ["date"], ["asc"]);
    this.actions.forEach(
      (a) =>
        (a.date = moment(a.date)
          .startOf("day")
          .startOf("hour")
          .startOf("minute")
          .startOf("second")
          .startOf("millisecond")
          .toDate())
    );
    this.poolVolume = poolVolume;
    this.food = food;
    this.fish = fish;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Créer un intervalle entre ces deux dates avec un espacement journalier
  //////////////////////////////////////////////////////////////////////////////////////////
  getDates(date0: Date, date1: Date): moment.Moment[] {
    let moment0 = moment(date0)
      .startOf("day")
      .startOf("hour")
      .startOf("minute")
      .startOf("second")
      .startOf("millisecond");
    const moment1 = moment(date1);

    let dates: moment.Moment[] = [];
    while (moment0.isBefore(moment1)) {
      dates.push(moment(moment0));
      moment0 = moment0.add(1, "days");
    }

    return dates;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Caculer le poids de la nourriture en fonction de la masse totale des poissons
  //////////////////////////////////////////////////////////////////////////////////////////
  getFoodWeight(averageWeight: number, totalWeight: number): number {
    let foodWeight = 0;
    if (!this.food) return foodWeight;

    for (let i = 0; i < this.food.tos.length; i++) {
      if (averageWeight < this.food.tos[i]) {
        foodWeight = (this.food!.foodRates[i] * totalWeight) / 100;
        break;
      }
    }

    return foodWeight;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer l'âge en semaines des poissons à partir de la date d'entrée des poissons
  //////////////////////////////////////////////////////////////////////////////////////////
  getFishAge(date: moment.Moment): number {
    if (!this.fish) return 0;
    if (this.actions.length === 0) return 0;
    const action0 = this.actions[0];
    let nbWeeksAtEntrance = 0;

    for (let i = 0; i < this.fish.weeks.length; i++) {
      if (action0.averageWeight! < this.fish.weights[i]) {
        // On prend le milieu de la plage en semaines
        if (i > 1)
          nbWeeksAtEntrance = (this.fish.weeks[i] + this.fish.weeks[i - 1]) / 2;
        else nbWeeksAtEntrance = this.fish.weeks[i] / 2;
        break;
      }
    }
    return nbWeeksAtEntrance + moment(date).diff(moment(action0.date), "weeks");
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer la pente de croissance du poisson à une date donnée
  //////////////////////////////////////////////////////////////////////////////////////////
  getGrowthRate(date: moment.Moment): number {
    const nbWeeks = this.getFishAge(date);
    if (nbWeeks === 0) return 0;

    const maxWeeks = this.fish!.weeks.length;
    for (let i = 0; i < maxWeeks; i++) {
      if (nbWeeks < this.fish!.weeks[i]) {
        if (i < 1) return this.fish!.weights[i] / this.fish!.weeks[i] / 7;
        else
          return (
            (this.fish!.weights[i] - this.fish!.weights[i - 1]) /
            (this.fish!.weeks[i] - this.fish!.weeks[i - 1]) /
            7
          );
      }
    }

    return (
      (this.fish!.weights[maxWeeks - 1] - this.fish!.weights[maxWeeks - 2]) /
      (this.fish!.weeks[maxWeeks - 1] - this.fish!.weeks[maxWeeks - 2]) /
      7
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer les données pour le bassin après une action de type "Vente", "Mortalité",
  // "Sortie définitive" ou "Transfert" mais vers un autre bassin
  //////////////////////////////////////////////////////////////////////////////////////////
  recomputeDataAfterDecrease(data: IData, nbFish: number): IData {
    const totalWeight = data.totalWeight - (nbFish * data.averageWeight) / 1000;
    const averageWeight =
      data.fishNumber - nbFish <= 0
        ? 0
        : (totalWeight / (data.fishNumber - nbFish)) * 1000;
    return {
      ...data,
      fishNumber: data.fishNumber - nbFish,
      density: (data.density * (data.fishNumber - nbFish)) / data.fishNumber,
      totalWeight: totalWeight,
      averageWeight: averageWeight,
      foodWeight: this.getFoodWeight(averageWeight, totalWeight),
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer les données pour le bassin après une action de type "Entrée du lot" ou
  // "Transfert" vers le bassin courant
  //////////////////////////////////////////////////////////////////////////////////////////
  recomputeDataAfterIncrease(data: IData, nbFish: number): IData {
    const totalWeight = data.totalWeight + (nbFish * data.averageWeight) / 1000;
    const averageWeight = (totalWeight / (data.fishNumber + nbFish)) * 1000;
    return {
      ...data,
      fishNumber: data.fishNumber + nbFish,
      density: (data.density * (data.fishNumber + nbFish)) / data.fishNumber,
      totalWeight: totalWeight,
      averageWeight: averageWeight,
      foodWeight: this.getFoodWeight(averageWeight, totalWeight),
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Recalculer la donnée au jour J à partir de la donnée J-1
  // Traite tous les cas possibles: "Entrée du lot", "Pesée", "Vente", "Mortalité", "Transfert"
  //////////////////////////////////////////////////////////////////////////////////////////
  recomputeDataFromAction(lastData: IData, action: IAction): IData {
    let data: IData;
    switch (action.type) {
      case "Vente":
      case "Sortie définitive":
      case "Mortalité":
        data = {
          ...this.recomputeDataAfterDecrease(lastData, action.fishNumber!),
          dateFormatted: moment(action.date).format("DD/MM/YYYY"),
          actionType: action.type,
          actionWeight: action.totalWeight!,
        };
        break;
      case "Transfert":
        if (action.secondPoolId)
          data = {
            ...this.recomputeDataAfterDecrease(lastData, action.fishNumber!),
            dateFormatted: moment(action.date).format("DD/MM/YYYY"),
            actionType: action.type,
            actionWeight: action.totalWeight!,
          };
        else
          data = {
            ...this.recomputeDataAfterIncrease(lastData, action.fishNumber!),
            dateFormatted: moment(action.date).format("DD/MM/YYYY"),
            actionType: action.type,
            actionWeight: action.totalWeight!,
          };
        break;
      case "Pesée":
        data = {
          ...lastData,
          dateFormatted: moment(action.date).format("DD/MM/YYYY"),
          actionType: action.type,
          averageWeight: (action.totalWeight! / lastData.fishNumber!) * 1000,
          totalWeight: action.totalWeight!,
          density: action.totalWeight! / this.poolVolume,
        };
        break;
      case "Entrée du lot":
        data = {
          ...lastData,
          dateFormatted: moment(action.date).format("DD/MM/YYYY"),
          actionType: action.type,
          fishNumber: lastData.fishNumber! + action.fishNumber!,
          totalWeight: lastData.totalWeight! + action.totalWeight!,
          averageWeight:
            ((lastData.totalWeight! + action.totalWeight!) /
              (lastData.fishNumber! + action.fishNumber!)) *
            1000,
          density:
            (lastData.totalWeight! + action.totalWeight!) / this.poolVolume,
        };
        break;
      default:
        data = { ...lastData };
    }
    return data;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Récupérer le poids moyen sur le bassin lors de la prochaine action de type "Pesée"
  //////////////////////////////////////////////////////////////////////////////////////////
  getNextWeightAndDuration(index: number, nextWeight: any): boolean {
    const date0 = this.actions[index].date;
    let nextAction: IAction = this.actions[index];

    // Appliquer la prochaine action
    let lastData: IData = this.recomputeDataFromAction(
      this.data[this.data.length - 1],
      nextAction
    );
    index++;

    // Si la prochaine action n'est pas une pesée, on applique les actions en série
    // jusqu'à tomber sur la prochaine pesée
    while (nextAction.type !== "Pesée" && index <= this.actions.length - 1) {
      nextAction = this.actions[index];
      lastData = this.recomputeDataFromAction(lastData, nextAction);
      index++;
    }

    nextWeight.weight = lastData.averageWeight;
    nextWeight.nbDays = this.getDates(lastData.date, date0).length;
    return nextAction.type === "Pesée";
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Récupérer la dernière donnée du bassin
  //////////////////////////////////////////////////////////////////////////////////////////
  getLastData(index: number): IComputedData {
    const action0: IAction = this.actions[index];
    const data0: IData = {
      date: moment(action0.date)
        .startOf("day")
        .startOf("hour")
        .startOf("minute")
        .startOf("second")
        .startOf("millisecond")
        .toDate(),
      dateFormatted: moment(action0.date).format("DD/MM/YYYY"),
      averageWeight: action0.averageWeight!,
      totalWeight: action0.totalWeight!,
      fishNumber: action0.fishNumber!,
      lotName: action0.lotName!,
      actionType: action0.type,
      actionWeight: action0.totalWeight!,
      foodWeight: this.getFoodWeight(
        action0.averageWeight!,
        action0.totalWeight!
      ),
      density: action0.totalWeight! / this.poolVolume,
    };

    // Si aucune donnée et en plus l'action n'est pas une Entrée du lot ou un Transfert
    // => Erreur: il faut d'abord faire rentrer des poissons
    if (
      this.data.length === 0 &&
      action0.type !== "Entrée du lot" &&
      action0.type !== "Transfert"
    )
      return { error: "Première action non valide", data: null };

    // Si aucune donnée mais qu'on est sur une Entrée du lot par exemple,
    // => on initialise les données
    if (this.data.length === 0) {
      this.data.push(data0);
      return {
        error: "",
        data: data0,
      };
    }

    return {
      error: "",
      data: this.data[this.data.length - 1],
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer les données pour le bassin sur l'intervalle de temps (tous les jours)
  // entre la date de la index-ème action et la date de la (index+1)-ème action
  //////////////////////////////////////////////////////////////////////////////////////////
  computeData(index: number): IComputedData {
    if (index < 0 || index + 1 >= this.actions.length)
      return {
        error: "Index out of range",
        data: null,
      };

    // 1. Calculer l'échantillon des dates entre les deux actions
    const dates = this.getDates(
      this.actions[index].date,
      this.actions[index + 1].date
    );

    // 2. Si aucun écart entre les dates: par exemple même jour
    // => Pesée + Mortalité
    // => Retourne juste la donnée au jour J
    if (dates.length === 0 || dates.length === 1)
      return {
        error: "",
        data: [
          this.recomputeDataFromAction(
            this.data[this.data.length - 1],
            this.actions[index + 1]
          ),
        ],
      };

    // On ne rajoute pas le premier élément, il a été rajouté sur l'action précédente
    // En temps que dernière donnée, du coup on enlève la première date
    dates.shift();

    // 3. Récuper la donnée de la dernière action
    // qui va être la première donnée à partir de la quelle on va calculer
    // les autres données sur cette plage de temps
    const res: IComputedData = this.getLastData(index);
    if (res.error) return res;
    const lastData: IData = res.data! as IData;

    // 4. Récupérer le poids moyen sur le bassin lors de la prochaine Pesée
    // puis calculer les poids sur l'intervalle de temps
    let nextWeight = { weight: 0, nbDays: 0 };
    const bExistNextWeight = this.getNextWeightAndDuration(
      index + 1,
      nextWeight
    );
    const p0 = lastData.averageWeight;
    const slope = (nextWeight.weight - p0) / nextWeight.nbDays;

    // Recalculer les données sur l'intervalle de temps
    let averageWeight = lastData.averageWeight;
    const datas: IData[] = dates.map((date) => {
      if (bExistNextWeight) {
        const diffDays = date.diff(lastData.date, "days");
        averageWeight = p0! + slope * diffDays;
      }
      // S'il n'y a pas de prochaine pesée, on utilise la pente de croissance théorique
      else averageWeight += this.getGrowthRate(date);

      const totalWeight = (averageWeight * lastData.fishNumber!) / 1000;
      return {
        date: date.toDate(),
        dateFormatted: date.format("DD/MM/YYYY"),
        fishNumber: lastData.fishNumber!,
        averageWeight: lastData.fishNumber! > 0 ? averageWeight : 0,
        totalWeight: totalWeight,
        density: totalWeight / this.poolVolume,
        actionType: "",
        actionWeight: 0,
        lotName: lastData.lotName ?? "",
        foodWeight: this.getFoodWeight(averageWeight, totalWeight),
      };
    });

    // Rajouter la dernière donnée, qui sera utilisée pour la prochaine action
    datas.push(
      this.recomputeDataFromAction(
        datas[datas.length - 1],
        this.actions[index + 1]
      )
    );

    return {
      error: "",
      data: datas,
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Extrapoler les données sur les 100 prochains jours
  //////////////////////////////////////////////////////////////////////////////////////////
  extrapolateData(): void {
    const lastData = this.data[this.data.length - 1];
    const dates = this.getDates(
      lastData.date,
      moment(lastData.date).add(this.nbDaysOfExtrapolation, "days").toDate()
    );

    // Recalculer les données sur l'intervalle de temps
    let averageWeight = lastData.averageWeight;
    const datas: IData[] = dates.map((date, i) => {
      // S'il n'y a pas de prochaine pesée, on utilise la pente de croissance théorique
      const slope = this.getGrowthRate(date);
      averageWeight += slope;
      const totalWeight = (averageWeight * lastData.fishNumber!) / 1000;
      return {
        date: date.toDate(),
        dateFormatted: date.format("DD/MM/YYYY"),
        fishNumber: lastData.fishNumber!,
        averageWeight: lastData.fishNumber! > 0 ? averageWeight : 0,
        totalWeight: totalWeight,
        density: totalWeight / this.poolVolume,
        actionType: "",
        actionWeight: 0,
        lotName: lastData.lotName ?? "",
        foodWeight: this.getFoodWeight(averageWeight, totalWeight),
      };
    });

    this.data = this.data.concat(datas);

    let lastDeletedData: IData | null = null;
    for (let i = this.data.length - 1; i >= 0; i--) {
      if (this.data[i].fishNumber === 0) {
        lastDeletedData = this.data.splice(i, 1)[0];
      } else break;
    }

    if (lastDeletedData) this.data.push(lastDeletedData);
  }

  computeAllData(): IComputedData {
    for (let i = 0; i < this.actions.length - 1; i++) {
      let dataI = this.computeData(i);
      if (dataI.error || !dataI.data)
        return {
          error: dataI.error,
          data: null,
        };
      this.data = this.data.concat(dataI.data as IData[]);
    }

    this.extrapolateData();

    return {
      error: "",
      data: this.data,
    };
  }
}
