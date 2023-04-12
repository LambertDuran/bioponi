import Joi from "joi";

const poolSchema = Joi.object({
  id: Joi.number().min(0),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  number: Joi.number().required(),
  volume: Joi.number().required(),
  action: Joi.array().items(Joi.object()),
  user: Joi.number().min(0),
});

const validatePool = (pool: any) => {
  return poolSchema.validate(pool);
};

module.exports = {
  validatePool,
  poolSchema,
};
