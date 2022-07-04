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
  tile: Joi.array().items(Joi.string().required()).required(),
  // ad_present_location: Joi.object().items(Joi.string().required()).required(),
  // ad_posted_location: Joi.object().items(Joi.string().required()).required(),
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

// const electronicSchema = mongoose.Schema({
//   category: {
//     type: String,
//     required: true,
//   },
//   sub_category: {
//     type: String,
//     required: true,
//   },
//   device: {
//     type: String,
//   },
//   brand: {
//     type: String,
//   },
//   colour: {
//     type: String,
//   },
//   year: {
//     type: String,
//   },
//   state: {
//     type: String,
//   },

//   //commo fields
//   special_mention: [
//     {
//       type: String,
//     },
//   ],
//   description: {
//     type: String,
//   },
//   tile: [
//     {
//       type: String,
//     },
//   ],
//   ad_present_location: [
//     {
//       type: String,
//     },
//   ],
//   ad_posted_location: [
//     {
//       type: String,
//     },
//   ],
//   reported: {
//     type: Boolean,
//     default: false,
//   },
//   reported_ad_count: {
//     type: Number,
//   },
//   reported_by: {
//     user_id: {
//       type: String,
//     },
//     reason: {
//       type: String,
//     },
//     report_date: {
//       type: String,
//     },
//   },
//   ad_status: {
//     type: String,
//     default: "active",
//   },
//   ad_type: {
//     type: String,
//     default: "free",
//   },
//   ad_expire_date: {
//     type: String,
//   },
//   ad_promoted: {
//     type: String,
//   },
//   ad_promoted_type: {
//     type: String,
//     enum: ["Boost", "Premium", ""],
//     default: "",
//   },
//   ad_promoted_date: {
//     type: String,
//   },
// });

// const Electronic = mongoose.model("Electronic", electronicSchema, "ads");

// module.exports = Electronic;
