import Joi from "joi";
const { poolSchema } = require("./pool");
const { fishSchema } = require("./fish");

export default function validateAction(action: any) {
  if (
    action.type === "Transfert" &&
    (action.poolId === action.secondPool.id ||
      action.pool.id === action.secondPoolId ||
      action.pool.id === action.secondPool.id)
  )
    return {
      error: {
        details: [
          {
            message:
              "Le bassin de départ et d'arrivée ne peuvent pas être les mêmes!",
          },
        ],
      },
    };

  const schema = Joi.object({
    id: Joi.number().min(0),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    type: Joi.string().required(),
    date: Joi.date().required(),
    totalWeight: Joi.number().min(0),
    averageWeight: Joi.number().min(0),
    fishNumber: Joi.number().min(0).required(),
    lotName: Joi.string(),
    pool: poolSchema,
    poolId: Joi.number().min(0),
    fish: fishSchema,
    fishId: Joi.number().min(0),
    secondPool: poolSchema,
    secondPoolId: Joi.number().min(0),
  });
  return schema.validate(action);
}

module.exports = {
  validateAction,
};
