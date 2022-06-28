const Joi = require("joi");

let alertSchema = Joi.object()
  .keys({
    category: Joi.string().required(),
    sub_category: Joi.string().required(),
    name: Joi.string().required(),
    keyword: Joi.array().items(Joi.string().required()).required(),
    activate_status: Joi.string().required(),
  })
  .options({ allowUnknown: true });

module.exports = {
  alertSchema,
};
