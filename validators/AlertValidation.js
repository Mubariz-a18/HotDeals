const catSubCat = require("../utils/categorySubcategory");
const { ArrayOfString } = require("./Ads.Validator");

function validateAlert(body){
    const {
        name,
        category,
        sub_category,
        keywords,
      } = body;
  if (typeof name !== 'string' || !name || name.length > 30) return false;
    
  const catNames = Object.keys(catSubCat);
  if (!(catNames.includes(category) && catSubCat[category].includes(sub_category))) return false;

  if (keywords && (typeof keywords !== "object" || keywords.length > 5)) return false;

  if(!ArrayOfString(keywords,40)) return false

  return true;
}


module.exports = validateAlert