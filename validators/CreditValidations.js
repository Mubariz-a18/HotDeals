const catSubCat = require("../utils/categorySubcategory");
const { boost_vales } = require("../utils/creditValues");
const { validateMongoID } = require("./Ads.Validator");

function validateCheckCreditBody(body) {
    const {
        category,
        AdsArray
    } = body
    const catNames = Object.keys(catSubCat);
    if (!catNames.includes(category)) return false;

    if (!AdsArray || typeof AdsArray !== "object") {
        return false
    }
    if (typeof AdsArray.isPrime !== 'boolean' || typeof AdsArray.isHighlighted !== 'boolean' || typeof AdsArray.isBoosted !== 'boolean') {
        return false
    }

    return true;
}


function validateBoostMyAd(body) {
    const {
        category,
        boost_duration,
        ad_id
    } = body;
    if (!validateMongoID(ad_id)) return false
    const catNames = Object.keys(catSubCat);
    if (!(catNames.includes(category))) return false;
    if (typeof boost_duration !== 'string' || !boost_vales.General_Boost.hasOwnProperty(boost_duration) && !boost_vales.Premium_Boost.hasOwnProperty(boost_duration)) return false
    return true
}


function ValidateMakeAdPremiumBody(body) {
    const {
        ad_id,
        category,
        AdsArray
    } = body;
    if (!validateMongoID(ad_id)) return false
    const catNames = Object.keys(catSubCat);
    if (!(catNames.includes(category))) return false;
    if (!AdsArray || typeof AdsArray !== "object") {
        return false
    }
    if (typeof AdsArray.isPrime !== 'boolean' || typeof AdsArray.isHighlighted !== 'boolean' || typeof AdsArray.isBoosted !== 'boolean') {
        return false
    }
    return true
}


function validateHighlightMyAdbody(body) {
    const {
        category,
        HighLight_Duration,
        ad_id
    } = body;
    if (!validateMongoID(ad_id)) return false
    const catNames = Object.keys(catSubCat);
    if (!(catNames.includes(category))) return false;
    if (!HighLight_Duration || typeof HighLight_Duration !== 'number' || HighLight_Duration !== 15) return false
    return true
}





module.exports = {
    validateCheckCreditBody,
    validateBoostMyAd,
    ValidateMakeAdPremiumBody,
    validateHighlightMyAdbody
}