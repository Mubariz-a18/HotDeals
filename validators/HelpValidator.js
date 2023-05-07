const { IsimageArrInvalid } = require("./Ads.Validator")

function validateHelpBody(body){
    const {
        phone_Info,
        title, 
        description, 
        attachment
    } = body;
    if(!phone_Info||!title || !description) return false
    if(!IsimageArrInvalid(attachment)) return false

    return true
  }
  
  
  module.exports = {
    validateHelpBody
  }