const userProfileValidator = require('./userProfile.validator');
const adsValidator = require('./Ads.Validator');
const alertValidator = require('./alert.validator')
module.exports = {
    updatePofile:userProfileValidator.userSchema,
    CreateAdsValidator:adsValidator.commonFieldSchema,
    createAlertValidator:alertValidator.alertSchema
}