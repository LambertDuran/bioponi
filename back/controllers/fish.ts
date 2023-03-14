const Joi = require("joi");

export default function validateFish(fish: any) {
  const schema = Joi.object({
    id: Joi.number().min(0),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    name: Joi.string().min(3).max(50).required(),
    weeks: Joi.array()
      .items(Joi.number().min(0).max(200).required())
      .required(),
    weights: Joi.array()
      .items(Joi.number().min(0).max(5000).required())
      .required(),
    foodId: Joi.number().min(0).required(),
    food: Joi.object(),
  });

  const err = schema.validate(fish);
  if (err.error) return err;

  if (fish.weeks.length !== fish.weights.length)
    return {
      error: {
        details: [{ message: "tableaux de tailles différentes" }],
      },
    };

  return { error: null };
}
