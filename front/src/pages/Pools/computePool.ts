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
          actionType: action.type,
          actionWeight: action.totalWeight!,
        };
        break;
      case "Transfert":
        if (action.secondPoolId)
          data = {
            ...this.recomputeDataAfterDecrease(lastData, action.fishNumber!),
            actionType: action.type,
            actionWeight: action.totalWeight!,
          };
        else
          data = {
            ...this.recomputeDataAfterIncrease(lastData, action.fishNumber!),
            actionType: action.type,
            actionWeight: action.totalWeight!,
          };
        break;
      default:
        data = {
          date: action.date,
          dateFormatted: moment(action.date).format("DD/MM/YYYY"),
          averageWeight: action.averageWeight!,
          totalWeight: action.totalWeight!,
          fishNumber: action.fishNumber!,
          lotName: action.lotName!,
          actionType: action.type,
          actionWeight: action.totalWeight!,
          foodWeight: 0,
          density: action.totalWeight! / this.poolVolume,
        };
        break;
    }
    return data;
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
  // Récupérer la dernière donnée du bassin
  //////////////////////////////////////////////////////////////////////////////////////////
  getLastData(index: number): IComputedData {
    const action0: IAction = this.actions[index];
    const data0: IData = {
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
    // console.log("lastData", lastData);

    // 3. Récupérer le poids moyen sur le bassin lors de la prochaine Pesée
    // puis calculer les poids sur l'intervalle de temps
    let nextAverageWeight = { value: 0 };
    if (this.getNextWeight(index1, nextAverageWeight)) {
      const p0 = lastData.averageWeight;
      const p1 = nextAverageWeight.value;
      const nbDays = dates.length;
      const slope = (p1! - p0!) / nbDays;
      // console.log("action0", action0);
      // console.log("action1", action1);
      // console.log("index1", index1);
      // console.log("p0", p0);
      // console.log("p1", p1);
      // console.log("nbDays", nbDays);
      // console.log("slope", slope);
      // console.log("dates", dates);

      const datas: IData[] = dates.map((date, i) => {
        const averageWeight = p0! + slope * date.diff(lastData.date, "days");
        const totalWeight = (averageWeight * lastData.fishNumber!) / 1000;
        const actionType = i === 0 ? lastData.actionType : "";

        const data = {
          date: date.toDate(),
          dateFormatted: date.format("DD/MM/YYYY"),
          fishNumber: lastData.fishNumber!,
          averageWeight: averageWeight,
          totalWeight: totalWeight,
          density: totalWeight / this.poolVolume,
          actionType: i === 0 ? lastData.actionType : "",
          actionWeight: fielsWithWeight.includes(actionType)
            ? lastData.totalWeight!
            : 0,
          lotName: lastData.lotName ?? "",
          foodWeight: 0,
        };
        // console.log("data", data);

        return data;
      });

      if (index > 0) {
        let data: IData;
        switch (action1.type) {
          case "Vente":
          case "Sortie définitive":
          case "Mortalité":
            data = {
              ...this.recomputeDataAfterDecrease(
                datas[datas.length - 1],
                action1.fishNumber!
              ),
              actionType: action1.type,
              actionWeight: action1.totalWeight!,
            };
            break;
          case "Transfert":
            if (action1.secondPoolId)
              data = {
                ...this.recomputeDataAfterDecrease(
                  datas[datas.length - 1],
                  action1.fishNumber!
                ),
                actionType: action1.type,
                actionWeight: action1.totalWeight!,
              };
            else
              data = {
                ...this.recomputeDataAfterIncrease(
                  datas[datas.length - 1],
                  action1.fishNumber!
                ),
                actionType: action1.type,
                actionWeight: action1.totalWeight!,
              };
            break;
          default:
            data = {
              date: action1.date,
              dateFormatted: moment(action1.date).format("DD/MM/YYYY"),
              averageWeight: action1.averageWeight!,
              totalWeight: action1.totalWeight!,
              fishNumber: action1.fishNumber!,
              lotName: action1.lotName!,
              actionType: action1.type,
              actionWeight: action1.totalWeight!,
              foodWeight: 0,
              density: action1.totalWeight! / this.poolVolume,
            };
            break;
        }

        // console.log("data last - ", data);

        datas.push(data);

        // console.log("datas", datas);
      }

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
    for (let i = 0; i < this.actions.length - 1; i++) {
      let dataI = this.computeData(i);
      // console.log("dataI", dataI);
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
