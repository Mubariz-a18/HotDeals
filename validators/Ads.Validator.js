const Joi = require("joi");

let reportedBy = Joi.object().keys({
  user_id: Joi.string().required(),
  reason: Joi.string().required(),
  report_date: Joi.date().iso().required(),
});

let commonFieldSchema = Joi.object().keys({
  category: Joi.string().required(),
  sub_category: Joi.string().required(),
  special_mention: Joi.array().items(Joi.string().required()).required(),
  description: Joi.string().required(),
  title: Joi.array().items(Joi.string().required()).required(),
  reported: Joi.boolean().default("false").optional(),
  reported_ad_count: Joi.number().optional(),
  reported_by: reportedBy,
  ad_status: Joi.string().default("").optional(),
  ad_type: Joi.boolean().default("free").optional(),
  ad_expire_date: Joi.date().iso().required(),
  ad_promoted: Joi.string().optional(),
  ad_promoted_type: Joi.string().optional(),
  ad_promoted_date: Joi.date().iso().required(),
  ad_promoted_expire_date:Joi.date().iso().required(),
}).options({allowUnknown: true});;


module.exports = {
    commonFieldSchema,
  };

