const featureAdsFunction = (getRecentAds , premiumAds) => {

    const length = getRecentAds.length;
    let premiumAdPosition = 6

    getRecentAds.splice(0, 0, premiumAds[0]);

    for (let i = 1; i <= length; i = i + 2) {
        if (premiumAds.length !== 0 && getRecentAds.length !== length) {
            getRecentAds.splice(premiumAdPosition, 0, premiumAds[i], premiumAds[i + 1])
            premiumAdPosition = premiumAdPosition + 7
        } else {

        }
    }
    const featureAds = getRecentAds.filter(Boolean)
    return featureAds
}

module.exports = {featureAdsFunction}