const Joi = require("joi");

export default function validateFood(food: any) {
  const schema = Joi.object({
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
    distribution: Joi.array().items(Joi.number().min(0).max(1000)).required(),
  });

  const err = schema.validate(food);
  if (err.error) return err;

  if (
    food.froms.length !== food.tos.length ||
    food.froms.length !== food.ranges.length ||
    food.froms.length !== food.sizes.length ||
    food.froms.length !== food.foodRates.length ||
    food.froms.length !== food.prices.length ||
    food.froms.length !== food.distribution.length
  )
    return {
      error: {
        details: [{ message: "arrays have different lengths!" }],
      },
    };

  for (let i = 0; i < food.froms.length; i++)
    if (food.froms[i] > food.tos[i])
      return {
        error: {
          details: [{ message: "froms must be smaller than tos!" }],
        },
      };

  return { error: null };
}
