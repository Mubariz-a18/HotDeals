const featureAdsFunction = (getRecentAds, premiumAds) => {

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

const BusinessAdsFunc = (PremiumAds,BusinessAds) => {
    const arr1 = PremiumAds
    const arr2 = BusinessAds
    let j = 0;
    for (let i = 2; i < arr1.length; i += 3) {
        arr1.splice(i, 0, arr2[j++]);
        if (j === arr2.length) break;
    }
    if (j < arr2.length) {
        arr1.push(...arr2.slice(j));
    }
    return arr1
}

module.exports = { featureAdsFunction, BusinessAdsFunc }