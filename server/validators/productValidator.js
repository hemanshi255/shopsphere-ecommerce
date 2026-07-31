const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Product name is required.",
      "any.required": "Product name is required.",
    }),

  description: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Description is required.",
      "any.required": "Description is required.",
    }),

  category: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Category is required.",
      "any.required": "Category is required.",
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number.",
      "number.positive": "Price must be greater than 0.",
      "any.required": "Price is required.",
    }),

  stock: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Stock must be a number.",
      "number.min": "Stock cannot be negative.",
      "any.required": "Stock is required.",
    }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  category: Joi.string().trim(),
  price: Joi.number().positive(),
  stock: Joi.number().min(0),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};