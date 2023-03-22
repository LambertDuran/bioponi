const joi = require("joi");

export default function validatePool(pool: any) {
  const schema = {
    number: joi.number().required(),
    volume: joi.number().required(),
  };
  return joi.validate(pool, schema);
}
