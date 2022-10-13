// Captializing firstLetters
function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getSelectionData(profileData) {
  let tempProfileData = { ...profileData };
  let seeProfileData = {};

  Object.keys(tempProfileData).map((profileKey) => {
    if (
      typeof profileData[profileKey] === "object" &&
      !profileData[profileKey]?.private
    ) {
      seeProfileData[profileKey] = profileData[profileKey];
    }
    if (typeof profileData[profileKey] === "string") {
      seeProfileData[profileKey] = profileData[profileKey];
    }
    if (profileData[profileKey] === profileData["follower_info"]) {
      seeProfileData[profileKey] = profileData[profileKey].length;
    }
    if (profileData[profileKey] === profileData["following_info"]) {
      seeProfileData[profileKey] = profileData[profileKey].length;
    }

  });
  return seeProfileData;
}

async function getFormattedDate(ISODate){
    let date = new Date(ISODate);
    if (date === undefined || date === null) return "";
    return date.toISOString().substring(0, 10);
}

module.exports = {
  capitalizeFirstLetter,
  getSelectionData,
  getFormattedDate
};
