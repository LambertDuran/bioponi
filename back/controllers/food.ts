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

  return schema.validate(food);
}
