const Profile = require('../models/Profile/Profile')

function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getSelectionData(profileData) {
  let tempProfileData = { ...profileData };
  // console.log("here:" + tempProfileData)
  // delete tempProfileData["fcmToken"];
  let seeProfileData = {};

  Object.keys(tempProfileData).map((profileKey) => {
    
    console.log(profileKey + "::: " + profileData[profileKey]);
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
  console.log("here:" + seeProfileData.email)

  return seeProfileData;
}

module.exports = {
  capitalizeFirstLetter,
  getSelectionData,
};
