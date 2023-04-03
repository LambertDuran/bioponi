import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).max(255).required(),
});

const validate = (user: any) => {
  const err = userSchema.validate(user);
  if (err.error) return err;
  return { error: null };
};

module.exports = {
  validate,
  userSchema,
};
