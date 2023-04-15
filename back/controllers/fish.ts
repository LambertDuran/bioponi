import Joi from "joi";
const { foodSchema } = require("./food");

const fishSchema = Joi.object({
  id: Joi.number().min(0),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  name: Joi.string().min(3).max(50).required(),
  weeks: Joi.array().items(Joi.number().min(0).max(200).required()).required(),
  weights: Joi.array()
    .items(Joi.number().min(0).max(5000).required())
    .required(),
  foodId: Joi.number().min(0),
  food: foodSchema,
  userId: Joi.number().min(0),
});

const validateFish = (fish: any) => {
  const err = fishSchema.validate(fish);
  if (err.error) return err;

  for (var i = 0; i < fish.weeks.length; i++) {
    if (!Number.isInteger(fish.weeks[i]))
      return {
        error: {
          details: [
            { message: "Les semaines doivent être des nombres entiers" },
          ],
        },
      };
  }

  for (var i = 0; i < fish.weights.length; i++) {
    if (!Number.isInteger(fish.weights[i]))
      return {
        error: {
          details: [{ message: "Les poids doivent être des nombres entiers" }],
        },
      };
  }

  if (fish.weeks.length !== fish.weights.length)
    return {
      error: {
        details: [{ message: "tableaux de tailles différentes" }],
      },
    };

  return { error: null };
};

module.exports = {
  validateFish,
  fishSchema,
};
