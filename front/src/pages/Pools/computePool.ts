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

  computeData(index: number): IComputedData {
    // console.log("actions: ", this.actions);
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

    let lastData: IData = this.data[this.data.length - 1];
    if (!lastData) return { error: "Dernière action non valide", data: null };

    // 3. Soit la seconde action est une pesée  -> Rien à faire
    let nextAction: IAction = this.actions[index];
    while (nextAction.type !== "Pesée") {
      // Soit la seconde action est :
      switch (nextAction.type) {
        // -  une mortalité                      -> On réduit le nombre de poissons
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

      if (index < this.actions.length - 2) index++;
      nextAction = this.actions[index];
    }

    // 4. On MAJ les poids entre les deux dernières pesées
    if (nextAction.type === "Pesée") {
      //   console.log("action0", action0);
      //   console.log("nextAction", nextAction);
      const p1 = action0.averageWeight;
      const p2 = nextAction.averageWeight;
      const nbDays = moment(nextAction.date).diff(action0.date, "days");
      const slope = (p2! - p1!) / nbDays;

      const datas: IData[] = dates.map((date, i) => {
        const averageWeight = p1! + slope * date.diff(action0.date, "days");
        const totalWeight = averageWeight * action0.fishNumber!;
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
