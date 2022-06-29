const userProfileValidator = require('./userProfile.validator');
const adsValidator = require('./Ads.Validator');
const SchemaValidator = require('./Schema.Validator')
module.exports = {
    updatePofile:userProfileValidator.userSchema,
    CreateAdsValidator:adsValidator.commonFieldSchema,
    AlertValidator:SchemaValidator.alertSchema,
    complainValidator:SchemaValidator.complainSchema,
    HelpValidator:SchemaValidator.helpCenterSchema,
    CreditValidator:SchemaValidator.creditSchema,
    OTPValidator:SchemaValidator.otpSchema
    
}