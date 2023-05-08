const {
    validateMongoID,
    validateLocation,
    isImageInvalid } = require("./Ads.Validator");

function validateSubAds(subAds) {
    if (subAds && typeof subAds !== 'object') return false
    for (let i = 0; i < subAds.length; i++) {
        const {
            title,
            description,
            redirectionUrl
        } = subAds[i]
        if (typeof subAds[i] !== 'object') return false;
        if (!title || !description || !redirectionUrl) return false
        if (typeof title !== 'string' || typeof description !== 'string' || typeof redirectionUrl !== 'string') return false
    }
    return true
}

function ValidateBusinessBody(body) {
    const {
        parentID,
        description,
        title,
        imageUrl,
        location,
        address,
        subAds,
        duration,
    } = body;

    // if (!validateMongoID(parentID)) return false;

    if (typeof description !== 'string' || !description || description.length > 500) return false;

    if (typeof title !== 'string' || !title || title.length > 40) return false;

    if (typeof imageUrl !== 'string' || !imageUrl) return false;


    const isLocationValid = validateLocation(location);
    if (!isLocationValid) return false;

    if (typeof address !== 'string' || !address) return false;

    if (!validateSubAds(subAds)) return false;

    if (!duration || typeof duration !== 'number') return false

    return true;

};

function ValidateUpdateBusinessBody(body) {
    const {
        adID,
        description,
        title,
        imageUrl,
        location,
        address,
        subAds,
        duration,
    } = body;

    if (!validateMongoID(adID)) return false;

    if (typeof description !== 'string' || !description || description.length > 500) return false;

    if (typeof title !== 'string' || !title || title.length > 40) return false;

    if (typeof imageUrl !== 'string' || !imageUrl) return false;


    const isLocationValid = validateLocation(location);
    if (!isLocationValid) return false;

    if (typeof address !== 'string' || !address) return false;

    if (!validateSubAds(subAds)) return false;


    return true;

};

function validatePhoneNumer(phoneNumber, smsToken) {
    if (!phoneNumber) return false
    if (typeof phoneNumber !== 'string' || phoneNumber.length !== 10) return false
    return true
};

function urlTest(url) {
    const urlRegex = /^(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/
    return urlRegex.test(url)
};

function ValidateBusinessProfile(body) {
    const {
        name,
        address,
        phoneNumber,
        description,
        businessUrl,
        certificateUrl,
    } = body;

    if (typeof name !== 'string' || !name || name.length > 40) return false;
    if (typeof address !== 'string' || !address || address.length > 200) return false;
    if (typeof description !== 'string' || !description || description.length > 500) return false;
    if (!validatePhoneNumer(phoneNumber)) return false;
    if (typeof businessUrl !== 'string' || !businessUrl || !urlTest(businessUrl)) return false;
    if (typeof certificateUrl !== 'string' || !certificateUrl || !isImageInvalid(certificateUrl)) return false;

    return true
};


module.exports = {
    ValidateBusinessBody,
    ValidateUpdateBusinessBody,
    ValidateBusinessProfile
}