const Joi = require("joi");

const foodSchema = Joi.object({
  id: Joi.number().min(0),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  name: Joi.string().min(3).max(50).required(),
  froms: Joi.array()
    .items(Joi.number().min(0).max(10000).required())
    .required(),
  tos: Joi.array().items(Joi.number().min(0).max(10000).required()).required(),
  ranges: Joi.array().items(Joi.string().min(3).max(50).required()).required(),
  sizes: Joi.array().items(Joi.number().min(1).max(100).required()).required(),
  foodRates: Joi.array()
    .items(Joi.number().min(0).max(100).required())
    .required(),
  prices: Joi.array()
    .items(Joi.number().min(0).max(20000).required())
    .required(),
  distributions: Joi.array().items(Joi.number().min(0).max(1000)).required(),
  userId: Joi.number().min(0),
});

const validateFood = (food: any) => {
  const err = foodSchema.validate(food);
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

  for (let i = 0; i < food.froms.length; i++) {
    if (i + 1 < food.froms.length) {
      if (food.tos[i] !== food.froms[i + 1])
        return {
          error: {
            details: [
              { message: "A from is different thant the previous to!" },
            ],
          },
        };
    }
  }
  return { error: null };
};

module.exports = {
  foodSchema,
  validateFood,
};
