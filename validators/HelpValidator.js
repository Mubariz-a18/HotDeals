
const firebaseStorageBucketUrlImage = 'https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/helpImages'

function IsHelpimageArrInvalid(image_url) {
  for (let i = 0; i < image_url.length; i++) {
    if (!(image_url[i].startsWith(firebaseStorageBucketUrlImage) || image_url[i].startsWith(googleCloudStorageBucketUrl))) return false
  }
  return true
};

function validateHelpBody(body){
    const {
        phone_Info,
        title, 
        description, 
        attachment
    } = body;
    if(!phone_Info||!title || !description) return false
    if(!IsHelpimageArrInvalid(attachment)) return false

    return true
  }
  
  
  module.exports = {
    validateHelpBody
  }