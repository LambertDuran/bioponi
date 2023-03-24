import Joi from "joi";

const poolSchema = Joi.object({
  id: Joi.number().min(0),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  number: Joi.number().required(),
  volume: Joi.number().required(),
});

const validatePool = (pool: any) => {
  return poolSchema.validate(pool);
};

module.exports = {
  validatePool,
  poolSchema,
};
