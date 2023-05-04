import IAction from "../../interfaces/action";
import Food from "../../interfaces/food";
import IFish from "../../interfaces/fish";
import { IData, IComputedData } from "../../interfaces/data";
import moment from "moment";
import { orderBy, findLast } from "lodash";

export default class ComputePool {
  actions: IAction[] = [];
  data: IData[] = [];
  poolVolume: number = 0;
  food: Food | null = null;
  fish: IFish | null = null;
  nbDaysOfExtrapolation = 60;

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
  // Caculer le poids de la nourriture en fonction de la masse totale des poissons
  // ATTENTION: On utilise la croissance théorique des poissons et non la croissance
  // observée !
  //////////////////////////////////////////////////////////////////////////////////////////
  getFoodWeightForDate(date: Date, totalWeight: number): number {
    return this.getFoodWeight(this.getTheoricWeight(date), totalWeight);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Récupérer le poids et la date de la dernière pesée juste avant la date en param
  // Si pas de dernière pesée => retourne les infos pour l'entrée du lot
  //////////////////////////////////////////////////////////////////////////////////////////
  getLastWeightAndDate(date: Date): { weight: number; date: Date } {
    const lastAction = findLast(this.actions, (a) => {
      return a.type === "Pesée" && a.date <= date;
    });
    if (!lastAction)
      return {
        weight: this.actions[0].averageWeight!,
        date: this.actions[0].date,
      };

    return {
      weight: lastAction.averageWeight!,
      date: lastAction.date,
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Retourne le poids moyen des poissons du bassin selon le modèle théorique, si une pesée
  // a eu lieu avant la date donnée, on applique l'évolution théorique du poids du poisson
  // à partir du poids observé lors de la dernière pesée
  //////////////////////////////////////////////////////////////////////////////////////////
  getTheoricWeight(date: Date) {
    if (this.actions.length === 0) return 0;

    let { weight, date: dateWeight } = this.getLastWeightAndDate(date);
    let date0 = moment(dateWeight);
    const momentDate = moment(date);

    while (date0.isBefore(momentDate)) {
      const growth = this.getTheoricGrowthRate(date0);
      weight += growth;
      date0 = date0.add(1, "days");
    }

    return weight;
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
  // Retourner le taux de rationnement des poissons (en faisant évoluer le poids selon le
  // modèle théorique)
  //////////////////////////////////////////////////////////////////////////////////////////
  getFoodRate(date: Date) {
    if (!this.food) return 0;
    const averageWeight = this.getTheoricWeight(date);

    for (let i = 0; i < this.food?.foodRates.length; i++)
      if (averageWeight < this.food.tos[i]) return this.food.foodRates[i];

    return this.food.foodRates[this.food.foodRates.length - 1];
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Retourner la fréquence de distribution de nourriture (en faisant évoluer le poids selon le
  // modèle théorique)
  //////////////////////////////////////////////////////////////////////////////////////////
  getDistributionRate(date: Date) {
    if (!this.food) return 0;
    const averageWeight = this.getTheoricWeight(date);

    for (let i = 0; i < this.food?.distributions.length; i++)
      if (averageWeight < this.food.tos[i]) return this.food.distributions[i];

    return this.food.distributions[this.food.distributions.length - 1];
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer la pente de croissance du poisson à une date donnée
  //////////////////////////////////////////////////////////////////////////////////////////
  getTheoricGrowthRate(date: moment.Moment): number {
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
      foodWeight: this.getFoodWeightForDate(data.date, totalWeight),
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
      foodWeight: this.getFoodWeightForDate(data.date, totalWeight),
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Recalculer la donnée au jour J à partir de la donnée J-1
  // Traite tous les cas possibles: "Entrée du lot", "Pesée", "Vente", "Mortalité", "Transfert"
  //////////////////////////////////////////////////////////////////////////////////////////
  recomputeDataFromAction(lastData: IData, action: IAction): IData {
    let data: IData;
    switch (action.type) {
      case "Sortie définitive":
        data = {
          date: action.date,
          dateFormatted: moment(action.date).format("DD/MM/YYYY"),
          averageWeight: 0,
          totalWeight: 0,
          fishNumber: 0,
          lotName: "",
          actionType: action.type,
          actionWeight: 0,
          foodWeight: 0,
          density: 0,
        };
        break;
      case "Vente":
      case "Mortalité":
        data = {
          ...this.recomputeDataAfterDecrease(lastData, action.fishNumber!),
          date: action.date,
          dateFormatted: moment(action.date).format("DD/MM/YYYY"),
          actionType: action.type,
          actionWeight: action.totalWeight!,
        };
        break;
      case "Transfert":
        if (action.secondPoolId)
          data = {
            ...this.recomputeDataAfterDecrease(lastData, action.fishNumber!),
            date: action.date,
            dateFormatted: moment(action.date).format("DD/MM/YYYY"),
            actionType: action.type,
            actionWeight: action.totalWeight!,
          };
        else
          data = {
            ...this.recomputeDataAfterIncrease(lastData, action.fishNumber!),
            date: action.date,
            dateFormatted: moment(action.date).format("DD/MM/YYYY"),
            actionType: action.type,
            actionWeight: action.totalWeight!,
          };
        break;
      case "Pesée":
        data = {
          ...lastData,
          date: action.date,
          dateFormatted: moment(action.date).format("DD/MM/YYYY"),
          actionType: action.type,
          averageWeight: (action.totalWeight! / action.fishNumber!) * 1000,
          totalWeight:
            (action.totalWeight! / action.fishNumber!) * lastData.fishNumber,
          density: action.totalWeight! / this.poolVolume,
          foodWeight: this.getFoodWeightForDate(
            action.date,
            (action.totalWeight! / action.fishNumber!) * lastData.fishNumber
          ),
        };
        break;
      case "Entrée du lot":
        data = {
          ...lastData,
          date: action.date,
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
    const date0 = this.actions[index - 1].date;
    let nextAction: IAction = this.actions[index];
    if (nextAction.type === "Sortie définitive") return false;

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

      if (nextAction.type === "Sortie définitive") return false;

      lastData = this.recomputeDataFromAction(lastData, nextAction);
      index++;
    }

    nextWeight.weight = lastData.averageWeight;
    nextWeight.nbDays = this.getDates(date0, lastData.date).length;
    return nextAction.type === "Pesée";
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Récupérer la dernière donnée du bassin
  //////////////////////////////////////////////////////////////////////////////////////////
  getLastData(index: number): IComputedData {
    const action0: IAction = this.actions[index];
    const date0 = moment(action0.date)
      .startOf("day")
      .startOf("hour")
      .startOf("minute")
      .startOf("second")
      .startOf("millisecond")
      .toDate();
    const data0: IData = {
      date: date0,
      dateFormatted: moment(action0.date).format("DD/MM/YYYY"),
      averageWeight: action0.averageWeight!,
      totalWeight: action0.totalWeight!,
      fishNumber: action0.fishNumber!,
      lotName: action0.lotName!,
      actionType: action0.type,
      actionWeight: action0.totalWeight!,
      foodWeight: this.getFoodWeightForDate(date0, action0.totalWeight!),
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

  pushLastData(datas: IData[], index: number, slope: number) {
    let data: IData = datas[datas.length - 1];
    const action = this.actions[index + 1];

    if (
      action.type === "Mortalité" ||
      (action.type === "Transfert" && action.secondPoolId) ||
      action.type === "Vente"
    ) {
      data = {
        ...this.recomputeDataFromAction(data, action),
        averageWeight: data.averageWeight + slope,
      };
    } else data = this.recomputeDataFromAction(data, action);

    datas.push(data);
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

    // 2. Récuper la donnée de la dernière action
    // qui va être la première donnée à partir de la quelle on va calculer
    // les autres données sur cette plage de temps
    const res: IComputedData = this.getLastData(index);
    if (res.error) return res;
    const lastData: IData = res.data! as IData;

    // 3. Récupérer le poids moyen sur le bassin lors de la prochaine Pesée
    // puis calculer les poids sur l'intervalle de temps
    let nextWeight = { weight: 0, nbDays: 0 };
    const bExistNextWeight = this.getNextWeightAndDuration(
      index + 1,
      nextWeight
    );
    const p0 = lastData.averageWeight;
    let slope = bExistNextWeight
      ? (nextWeight.weight - p0) / nextWeight.nbDays
      : 0.0;
    let averageWeight = p0;

    // 4. Si aucun écart entre les dates: par exemple même jour
    // => Pesée + Mortalité
    // => Retourne juste la donnée au jour J
    if (dates.length === 0)
      return {
        error: "",
        data: [
          this.recomputeDataFromAction(
            this.data[this.data.length - 1],
            this.actions[index + 1]
          ),
        ],
      };

    if (dates.length === 1) {
      const action = this.actions[index + 1];
      const date = moment(action.date);
      if (bExistNextWeight) averageWeight = p0! + slope;
      else averageWeight += this.getTheoricGrowthRate(date);

      let data = this.recomputeDataFromAction(lastData, action);
      data = {
        ...data,
        averageWeight,
        totalWeight: (averageWeight * data.fishNumber!) / 1000,
      };
      return {
        error: "",
        data: [data],
      };
    }

    // On ne rajoute pas le premier élément, il a été rajouté sur l'action précédente
    // En temps que dernière donnée, du coup on enlève la première date
    dates.shift();

    // Recalculer les données sur l'intervalle de temps
    const datas: IData[] = dates.map((date) => {
      if (bExistNextWeight) {
        const diffDays = date.diff(lastData.date, "days");
        averageWeight = p0! + slope * diffDays;
      }
      // S'il n'y a pas de prochaine pesée, on utilise la pente de croissance théorique
      else {
        slope = this.getTheoricGrowthRate(date);
        averageWeight += slope;
      }

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
        foodWeight: this.getFoodWeightForDate(date.toDate(), totalWeight),
      };
    });

    // Rajouter la dernière donnée, qui sera utilisée pour la prochaine action
    this.pushLastData(datas, index, slope);

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
    let dates = this.getDates(
      lastData.date,
      moment(lastData.date).add(this.nbDaysOfExtrapolation, "days").toDate()
    );
    dates.shift();

    // Recalculer les données sur l'intervalle de temps
    let averageWeight = lastData.averageWeight;
    const datas: IData[] = dates.map((date, i) => {
      // S'il n'y a pas de prochaine pesée, on utilise la pente de croissance théorique
      const slope = this.getTheoricGrowthRate(date);
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
        foodWeight: this.getFoodWeightForDate(date.toDate(), totalWeight),
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
    if (this.actions.length === 0) {
      return {
        error: "Aucune actions sur le bassin",
        data: null,
      };
    }

    if (this.actions.length === 1) {
      const data0: IComputedData = this.getLastData(0);
      if (data0.error) return data0;
      this.extrapolateData();
      return {
        error: "",
        data: this.data,
      };
    }

    for (let i = 0; i < this.actions.length - 1; i++) {
      let dataI = this.computeData(i);
      if (dataI.error || !dataI.data)
        return {
          error: dataI.error,
          data: null,
        };
      this.data = this.data.concat(dataI.data as IData[]);
    }

    if (!this.data.length)
      return { error: "Erreur dans le calcul des données", data: null };

    this.extrapolateData();

    return {
      error: "",
      data: this.data,
    };
  }
}
