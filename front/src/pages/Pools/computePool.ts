import IAction from "../../interfaces/action";
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

const fielsWithWeight = [
  "Vente",
  "Mortalité",
  "Transfert",
  "Sortie définitive",
];

export class ComputePool {
  actions: IAction[] = [];
  data: IData[] = [];
  poolVolume: number = 0;

  constructor(actions: IAction[], poolVolume: number) {
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
  // Calculer les données pour le bassin après une action de type "Vente", "Mortalité",
  // "Sortie définitive" ou "Transfert" mais vers un autre bassin
  //////////////////////////////////////////////////////////////////////////////////////////
  recomputeDataAfterDecrease(data: IData, nbFish: number): IData {
    return {
      ...data,
      fishNumber: data.fishNumber - nbFish,
      density: (data.density * (data.fishNumber - nbFish)) / data.fishNumber,
      totalWeight: data.totalWeight - (nbFish * data.averageWeight) / 1000,
      averageWeight:
        (data.totalWeight * 1000 - nbFish * data.averageWeight) /
        (data.fishNumber - nbFish),
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer les données pour le bassin après une action de type "Entrée du lot" ou
  // "Transfert" vers le bassin courant
  //////////////////////////////////////////////////////////////////////////////////////////
  recomputeDataAfterIncrease(data: IData, nbFish: number): IData {
    return {
      ...data,
      fishNumber: data.fishNumber + nbFish,
      density: (data.density * (data.fishNumber + nbFish)) / data.fishNumber,
      totalWeight: data.totalWeight + (nbFish * data.averageWeight) / 1000,
      averageWeight:
        (data.totalWeight * 1000 + nbFish * data.averageWeight) /
        (data.fishNumber + nbFish),
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
  getNextWeight(index: number, nextAverageWeight: any): boolean {
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

    nextAverageWeight.value = lastData.averageWeight;
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
      foodWeight: 0,
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
    // 0. Initialiser les variables
    const index0 = index;
    const index1 = index + 1;
    if (index0 < 0 || index1 >= this.actions.length)
      return {
        error: "Index out of range",
        data: null,
      };

    const action0 = this.actions[index0];
    const action1 = this.actions[index1];

    // 1. Calculer l'échantillon des dates entre les deux actions
    const dates = this.getDates(
      this.actions[index0].date,
      this.actions[index1].date
    );

    // 2. Si aucun écart entre les dates: par exemple même jour
    // => Pesée + Mortalité
    // => Retourne juste la donnée au jour J
    if (dates.length === 0)
      return {
        error: "",
        data: [
          this.recomputeDataFromAction(
            this.data[this.data.length - 1],
            action1
          ),
        ],
      };

    // 3. Récuper la donnée de la dernière action
    // qui va être la première donnée à partir de la quelle on va calculer
    // les autres données sur cette plage de temps
    const res: IComputedData = this.getLastData(index0);
    if (res.error) return res;
    const lastData: IData = res.data! as IData;

    // 4. Récupérer le poids moyen sur le bassin lors de la prochaine Pesée
    // puis calculer les poids sur l'intervalle de temps
    let nextAverageWeight = { value: 0 };
    if (this.getNextWeight(index1, nextAverageWeight)) {
      const p0 = lastData.averageWeight;
      const p1 = nextAverageWeight.value;
      const nbDays = dates.length;
      console.log("p0", p0);
      console.log("p1", p1);
      console.log("nbDays", nbDays);
      const slope = (p1! - p0!) / nbDays;

      // On ne rajoute pas le premier élément, il a été rajouté sur l'action précédente
      // En temps que dernière donnée
      dates.shift();

      const datas: IData[] = dates.map((date) => {
        const diffDays = date.diff(lastData.date, "days");
        const averageWeight = p0! + slope * diffDays;
        const totalWeight = (averageWeight * lastData.fishNumber!) / 1000;
        return {
          date: date.toDate(),
          dateFormatted: date.format("DD/MM/YYYY"),
          fishNumber: lastData.fishNumber!,
          averageWeight: averageWeight,
          totalWeight: totalWeight,
          density: totalWeight / this.poolVolume,
          actionType: "",
          actionWeight: 0,
          lotName: lastData.lotName ?? "",
          foodWeight: 0,
        };
      });

      // Rajouter la dernière donnée, qui sera utilisée pour la prochaine action
      datas.push(
        this.recomputeDataFromAction(datas[datas.length - 1], action1)
      );

      return {
        error: "",
        data: datas,
      };
    }

    // 5. Il ne reste plus de pesée
    // => on doit utiliser la courbe de croissance théorique du poisson
    else {
    }

    return {
      error: "",
      data: null,
    };
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

    return {
      error: "",
      data: this.data,
    };
  }
}
