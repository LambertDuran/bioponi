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
      totalWeight: data.totalWeight - nbFish * data.averageWeight,
      averageWeight:
        (data.totalWeight - nbFish * data.averageWeight) /
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
      totalWeight: data.totalWeight + nbFish * data.averageWeight,
      averageWeight:
        (data.totalWeight + nbFish * data.averageWeight) /
        (data.fishNumber + nbFish),
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Récupérer le poids moyen sur le bassin lors de la prochaine action de type "Pesée"
  //////////////////////////////////////////////////////////////////////////////////////////
  getNextWeight(index: number, nextAverageWeight: any): boolean {
    let lastData: IData = this.data[this.data.length - 1];
    let nextAction: IAction = this.actions[index];
    while (nextAction.type !== "Pesée" && index <= this.actions.length - 1) {
      nextAction = this.actions[index];

      // Soit la seconde action est :
      switch (nextAction.type) {
        // - une mortalité                       -> On réduit le nombre de poissons
        // - une vente ou une sortie définitive  -> On réduit le nombre de poissons
        case "Vente":
        case "Sortie définitive":
        case "Mortalité":
          lastData = this.recomputeDataAfterDecrease(
            lastData,
            lastData.fishNumber
          );
          break;
        // - un transfert vers le bassin courant -> On augmente le nombre de poissons
        case "Transfert": {
          if (nextAction.secondPoolId)
            lastData = this.recomputeDataAfterDecrease(
              lastData,
              lastData.fishNumber
            );
          else {
            lastData = this.recomputeDataAfterIncrease(
              lastData,
              lastData.fishNumber
            );
          }
          break;
        }
      }
      index++;
    }

    nextAverageWeight.value = nextAction.averageWeight;
    return nextAction.type === "Pesée";
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Calculer les données pour le bassin sur l'intervalle de temps (tous les jours)
  // entre la date de la index-ème action et la date de la (index+1)-ème action
  //////////////////////////////////////////////////////////////////////////////////////////
  computeData(index: number): IComputedData {
    // 0. Initialiser les variables
    const index0 = index;
    const index1 = index + 1;
    const action0 = this.actions[index0];
    if (index0 < 0 || index1 >= this.actions.length)
      return {
        error: "Index out of range",
        data: null,
      };

    // 1. Calculer l'échantillon des dates entre les deux actions
    const dates = this.getDates(
      this.actions[index0].date,
      this.actions[index1].date
    );

    // 2. Récuper les dernières données, c-à-d le dernier IData
    // IData est vide et la première action n'est pas une entrée de lot ou un transfert => ERREUR
    if (this.data.length === 0) {
      if (
        index0 !== 0 ||
        (this.actions[0].type !== "Entrée du lot" &&
          this.actions[0].type !== "Transfert")
      )
        return { error: "Première action non valide", data: null };
      // Sinon, on initialise le tableau de données avec les données de l'entrée du lot
      else {
        this.data.push({
          date: action0.date,
          dateFormatted: moment(action0.date).format("DD/MM/YYYY"),
          averageWeight: action0.averageWeight!,
          totalWeight: action0.totalWeight!,
          fishNumber: action0.fishNumber!,
          lotName: action0.lotName!,
          actionType: action0.type,
          actionWeight: action0.totalWeight!,
          foodWeight: 0,
          density: action0.totalWeight! / this.poolVolume,
        });
      }
    }

    // 3. Récupérer le poids moyen sur le bassin lors de la prochaine Pesée
    let nextAverageWeight = { value: 0 };
    if (this.getNextWeight(index1, nextAverageWeight)) {
      const p1 = action0.averageWeight;
      const p2 = nextAverageWeight.value;
      const nbDays = moment(this.actions[index1].date).diff(
        action0.date,
        "days"
      );
      const slope = (p2! - p1!) / nbDays;

      const datas: IData[] = dates.map((date, i) => {
        const averageWeight = p1! + slope * date.diff(action0.date, "days");
        const totalWeight = (averageWeight * action0.fishNumber!) / 1000;
        const actionType = i === 0 ? action0.type : "";
        return {
          date: date.toDate(),
          dateFormatted: date.format("DD/MM/YYYY"),
          fishNumber: action0.fishNumber!,
          averageWeight: averageWeight,
          totalWeight: totalWeight,
          density: totalWeight / this.poolVolume,
          actionType: i === 0 ? action0.type : "",
          actionWeight: fielsWithWeight.includes(actionType)
            ? action0.totalWeight!
            : 0,
          lotName: action0.lotName ?? "",
          foodWeight: 0,
        };
      });

      return {
        error: "",
        data: datas,
      };
    }

    // 5. Il ne reste plus de pesée
    // => on doit utiliser la courbe de croissance théorique du poisson
    else {
    }

    // dates.forEach((date) => {
    //   console.log(date.format("DD/MM/YYYY"));
    // });

    return {
      error: "",
      data: null,
    };
  }

  computeAllData(): IComputedData {
    let computedData: IComputedData = {
      error: "",
      data: [],
    };

    // console.log("actions", this.actions);
    for (let i = 0; i < this.actions.length - 1; i++) {
      let dataI = this.computeData(i);
      if (dataI.error === "" && dataI.data)
        computedData.data = (computedData.data as IData[]).concat(
          dataI.data as IData[]
        );
      else {
        computedData.error = dataI.error;
        break;
      }
    }

    return computedData;
  }
}
