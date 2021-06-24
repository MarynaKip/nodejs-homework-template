const Joi = require('joi')

module.exports = {
  contactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      }),
      phone: Joi.string()
        .min(3)
        .max(30)
        .pattern(/\+?[0-9\s\-\\)]+/),
      favorite: Joi.boolean(),
    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
      return res.status(400).json({ status: validationResult.error.details })
    }
    next()
  },
}
