import Joi from "joi";
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userSchema = Joi.object({
  id: Joi.number().min(0),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  email: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).max(255).required(),
  name: Joi.string().min(3).max(50).required(),
  isAdmin: Joi.boolean(),
});

const validate = (user: any) => {
  const err = userSchema.validate(user);
  if (err.error) return err;
  return { error: null };
};

const generateAuthToken = (user: any) => {
  const token = jwt.sign(
    { id: user.id, isAdmin: user.isAdmin, name: user.name },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

module.exports = {
  generateAuthToken,
  validate,
  userSchema,
};
