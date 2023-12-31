const Joi = require("joi");

//Alert Schema Validation
let alertSchema = Joi.object()
  .keys({
    category: Joi.string().required(),
    sub_category: Joi.string().required(),
    name: Joi.string().required(),
    keyword: Joi.array().items(Joi.string().required()).required(),
    activate_status: Joi.string().required(),
  })
  .options({ allowUnknown: true });

//Complain Schema Validation
let complain = Joi.object().keys({
  reason: Joi.string().required(),
  complain_date: Joi.date().iso().required(),
});
let complainSchema = Joi.object()
  .keys({
    complain: complain,
    description: Joi.string().required(),
  })
  .options({ allowUnknown: true });

//Credit Schema Validation
// let creditSchema = Joi.object()
//   .keys({
//     credit_type: Joi.string().required(),
//     transcation_id: Joi.string().required(),
//     purchase_mode: Joi.string().required(),
//     purchase_date: Joi.string().required(),
//     expiray_date: Joi.string().required(),
//     activate_status: Joi.string().required(),
//   })
//   .options({ allowUnknown: true });

//Message Schema Validation
let message = Joi.object().keys({
  sender_message: Joi.string().required(),
  replied_mssage: Joi.string().required(),
});
let helpCenterSchema = Joi.object()
  .keys({
    phone_number: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    attachment: Joi.string().required(),
    message: message,
  })
  .options({ allowUnknown: true });

  //Complain Schema Validation
let phone = Joi.object().keys({
  text: Joi.string().length(10).required(),
});

//OTP Schema Validation
const getOTPSchema = Joi.object({
  phoneNumber: phone
}).options({ allowUnknown: true });

const verifyOTPSchema = Joi.object({
  phoneNumber: phone,
  otp: Joi.string().length(6).required(),
  fcmToken: Joi.string().allow(null, ""),
}).options({ allowUnknown: true });

const genericSchema = Joi.object({
  category:Joi.string().required(),
  sub_category:Joi.string().required(),
  description: Joi.string().required(),
}).options({ allowUnknown: true });

module.exports = {
  alertSchema,
  complainSchema,
  // creditSchema,
  helpCenterSchema,
  getOTPSchema,
  verifyOTPSchema,
  genericSchema
};
