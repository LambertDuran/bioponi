import IFood from "../../interfaces/food";
const Joi = require("joi");

export default function validateFood(food: IFood) {
  const schema = Joi.object({
    id: Joi.number(),
    name: Joi.string().min(3).max(50).required(),
    froms: Joi.array()
      .items(Joi.number().min(0).max(10000).required())
      .required(),
    tos: Joi.array()
      .items(Joi.number().min(0).max(10000).required())
      .required(),
    ranges: Joi.array()
      .items(Joi.string().min(3).max(50).required())
      .required(),
    sizes: Joi.array()
      .items(Joi.number().min(1).max(100).required())
      .required(),
    foodRates: Joi.array()
      .items(Joi.number().min(0).max(100).required())
      .required(),
    prices: Joi.array()
      .items(Joi.number().min(0).max(20000).required())
      .required(),
    distributions: Joi.array().items(Joi.number().min(0).max(1000)).required(),
  });

  const err = schema.validate(food);
  if (err.error) return err;

  if (
    food.froms.length !== food.tos.length ||
    food.froms.length !== food.ranges.length ||
    food.froms.length !== food.sizes.length ||
    food.froms.length !== food.foodRates.length ||
    food.froms.length !== food.prices.length ||
    food.froms.length !== food.distributions.length
  )
    return {
      error: {
        details: [{ message: "tableaux de tailles différentes" }],
      },
    };

  for (let i = 0; i < food.froms.length; i++)
    if (food.froms[i] > food.tos[i])
      return {
        error: {
          details: [{ message: "DE doit être plus grand que A" }],
        },
      };

  return { error: null };
}
