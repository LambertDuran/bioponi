const Joi = require("joi");

export default function validatePool(pool: any) {
  const schema = Joi.object({
    id: Joi.number().min(0),
    number: Joi.number().required(),
    volume: Joi.number().required(),
  });
  return schema.validate(pool);
}
