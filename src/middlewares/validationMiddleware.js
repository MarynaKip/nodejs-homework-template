const Joi = require('joi')

const { ValidationError } = require('../helpers/errors')

module.exports = {
  addContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi
        .string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      email: Joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        })
        .required(),
      phone: Joi
        .string()
        .min(3)
        .max(30)
        .pattern(/\+?[0-9\s\-\\)]+/)
        .required(),
      favorite: Joi.boolean(),
    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
      next(new ValidationError(validationResult.error.message));
    }
    next()
  },

  updateContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi
        .string()
        .alphanum()
        .min(3)
        .max(30),
      email: Joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        }),
      phone: Joi
        .string()
        .min(3)
        .max(30)
        .pattern(/\+?[0-9\s\-\\)]+/),
      favorite: Joi.boolean(),
    }).min(1)
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
      next(new ValidationError(validationResult.error.message));
    }
    next()
  },

  authValidation: (req, res, next) => {
    const schema = Joi.object({
      email: Joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        })
        .required(),
      password: Joi
        .string()
        .min(3)
        .required(),
    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
      next(new ValidationError(validationResult.error.message));
    }
    next()
  },
  subscriptionValidation: (req, res, next) => {
    const schema = Joi.object({
      subscription: Joi
        .string()
        .valid('starter', 'pro', 'business')
        .required(),

    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
      next(new ValidationError(validationResult.error.message));
    }
    next()
  },
}
