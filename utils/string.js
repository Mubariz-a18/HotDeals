const Profile = require('../models/Profile/Profile')

function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getSelectionData(profileData) {
  let tempProfileData = { ...profileData };
  // delete tempProfileData["fcmToken"];
  let seeProfileData = {};
  let getFollowersCount;
  let getFollowingCount;

  return seeProfileData;
}

module.exports = {
  capitalizeFirstLetter,
  getSelectionData,
};
