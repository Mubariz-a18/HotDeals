const globalWindowTime = {
    // all the values will be in minutes where as milliseconds is already defined in file (middleware/ratelimiterMiddleware.js)
    getGlobalsearchTime:1,
    getPremiumAdsTime:1,
    getFeaturedAdsTime:1,
    createAdTime:1,
    updateAdTime:1,
    getMyAdTime:1,
    getFavouriteAdsTime:1,
    changeAdStatusTime:1,
    makeAdFavouriteTime:1,
    getParticularAdsTime:1,
    getRelatedAdTime:1,
    getadStatusTime:1,
    createAlertTime:1,
    updateAlertTime:1,
    deleteAlertTime:1,
    getOtpTime:60,
    verifyOtpTime:60,
    getOtpEmailTime:60,
    verifyOtpEmailTime:60,
    createComplainTime:1,
    createCreditTime:1,
    getMycreditsTime:1,
    boostAdTime:1,
    highlightAdTime:1,
    followuserTime:1,
    unfollowuserTime:1,
    createHelpTime:1,
    deletehelpTime:1,
    getHelpTime:1,
    getMyProfileTime:1,
    getOthersProfileTime:1,
    updateProfileTime:1,
    createRatingTime:1,
    getRatingTime:1,
    reportAdTime:1,
    jsonDataTime:1
}

const globalApiHits = {
    getGlobalsearchHits:10,
    getPremiumAdsHits:10,
    getFeaturedAdsHits:10,
    updateAdHits:1,
    createAdHits:2,
    getMyAdHits:2,
    getFavouriteAdsHits:5,
    changeAdStatusHits:5,
    makeAdFavouriteHits:10,
    getParticularAdsHits:5,
    getRelatedAdHits:5,
    getadStatusHits:5,
    createAlertHits:5,
    updateAlertHits:5,
    deleteAlertHits:5,
    getOtpHits:5,
    verifyOtpHits:5,
    getOtpEmailHits:5,
    verifyOtpEmailHits:5,
    createComplainHits:2,
    createCreditHits:10,
    getMyCreditsHits:10,
    boostAdHits:10,
    highlightAdHits:10,
    followuserHts:20,
    unfollowuserHits:10,
    createHelpHits:5,
    deletehelpHits:5,
    getHelpHits:5,
    getMyProfileHits:5,
    getOthersProfileHits:5,
    updateProfileHits:5,
    createRatingHits:20,
    getRatingHits:20,
    reportAdHits:5,
    jsonDataHits:10
}


module.exports = {
    globalApiHits,
    globalWindowTime
}