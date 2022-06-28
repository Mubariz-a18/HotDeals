const userProfileValidator = require('./userProfile.validator');
const adsValidator = require('./Ads.Validator')
module.exports = {
    updatePofile:userProfileValidator.userSchema,
    CreateAdsValidator:adsValidator.commonFieldSchema,
}