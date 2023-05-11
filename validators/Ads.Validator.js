const Joi = require("joi");
const catSubCat = require('../utils/categorySubcategory');
const ValidateSelectFields = require("./SelectFields.Validation");
let reportedBy = Joi.object().keys({
  user_id: Joi.string().required(),
  reason: Joi.string().required(),
  report_date: Joi.date().iso().required(),
});

let commonFieldSchema = Joi.object().keys({
  category: Joi.string().required(),
  sub_category: Joi.string().required(),
  special_mention: Joi.array().items(Joi.string().required()).required(),
  description: Joi.string().required(),
  title: Joi.array().items(Joi.string().required()).required(),
  reported: Joi.boolean().default("false").optional(),
  reported_ad_count: Joi.number().optional(),
  reported_by: reportedBy,
  ad_status: Joi.string().default("").optional(),
  ad_type: Joi.boolean().default("free").optional(),
  ad_expire_date: Joi.date().iso().optional(),
  ad_promoted: Joi.string().optional(),
  ad_promoted_type: Joi.string().optional(),
  ad_promoted_date: Joi.date().iso().optional(),
  ad_promoted_expire_date: Joi.date().iso().optional(),
}).options({ allowUnknown: true });;


const validateLocation = (locationObj) => {
  if (!locationObj) {
    return false
  }
  if (locationObj.type !== "Point") {
    return false
  }
  if (typeof locationObj.coordinates !== "object") {
    return false
  }
  if (locationObj.coordinates.length !== 2) {
    return false
  }
  if (!isLatitude(locationObj.coordinates[0]) || !isLongitude(locationObj.coordinates[1])) {
    return false
  }
  return true
}

function isLatitude(number) {
  return (typeof number === 'number' && number >= -90 && number <= 90)
}

function isLongitude(number) {
  return (typeof number === 'number' && number >= -180 && number <= 180)
}


const firebaseStorageBucketUrlImage = 'https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/postimages'
const firebaseStorageBucketUrlVideos = "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/postvideos"
const googleCloudStorageBucketUrl = "https://storage.googleapis.com/true-list.appspot.com/"

function IsimageArrInvalid(image_url) {
  for (let i = 0; i < image_url.length; i++) {
    if (!(image_url[i].startsWith(firebaseStorageBucketUrlImage) || image_url[i].startsWith(googleCloudStorageBucketUrl))) return false
  }
  return true
};

function IsVideoArrInvalid(video_url) {
  for (let i = 0; i < video_url.length; i++) {
    if (!video_url[i].startsWith(firebaseStorageBucketUrlVideos)) return false
  }
  return true
};

function isImageInvalid(imageurl) {
  if (!(imageurl.startsWith(firebaseStorageBucketUrlImage) || imageurl.startsWith(googleCloudStorageBucketUrl))) return false
  return true
}

const validatePrimaryDetails = (primaryDetails) => {
  if (!primaryDetails || typeof primaryDetails !== 'object' || primaryDetails.length === 0) {
    return false;
  }
  for (let i = 0; i < primaryDetails.length; i++) {

    const obj = primaryDetails[i];

    const { ad_id, ad_posted_address, isPrime, AdsArray, ad_posted_location } = obj

    if (!ad_id || typeof ad_id !== 'string' || ad_id.length !== 24) {
      return false
    }
    if (!ad_posted_address || typeof ad_posted_address !== 'string') {
      return false
    }
    if (typeof isPrime !== 'boolean') {
      return false
    }
    const isLocationValid = validateLocation(ad_posted_location);
    if (!isLocationValid) {
      return false
    }

    if (!AdsArray || typeof AdsArray !== "object") {
      return false
    }
    if (typeof AdsArray.isPrime !== 'boolean' || typeof AdsArray.isHighlighted !== 'boolean' || typeof AdsArray.isBoosted !== 'boolean') {
      return false
    }

  }

  return true
};

function validateBody(body) {
  const {
    parent_id,
    category,
    sub_category,
    description,
    SelectFields, //TODO
    special_mention,
    title,
    price,
    image_url,
    video_url,
    ad_present_location,
    ad_present_address,
    ad_status,
    is_negotiable,
    primaryDetails
  } = body;

  if (typeof parent_id !== 'string' || parent_id.length !== 24) return false;

  const catNames = Object.keys(catSubCat);
  if (!(catNames.includes(category) && catSubCat[category].includes(sub_category))) return false;

  if (!ValidateSelectFields({ cat: category, subCat: sub_category, selectFields: SelectFields })) return false

  if (typeof description !== 'string' || !description || description.length > 500) return false;

  if (typeof title !== 'string' || !title || title.length > 40) return false;

  if (typeof price !== 'number' || !price || price.length > 12) return false;

  if (typeof image_url !== 'object' || !image_url || !(image_url.length > 0 && image_url.length <= 10)) return false;

  if (!IsimageArrInvalid(image_url)) return false

  if (video_url && (typeof video_url !== 'object' || video_url.length > 2)) return false;

  if (!IsVideoArrInvalid(video_url)) return false

  if (typeof ad_present_address !== 'string' || !ad_present_address) return false;

  const isLocationValid = validateLocation(ad_present_location);
  if (!isLocationValid) return false;

  if (ad_status !== "Selling") return false;

  if (special_mention && (typeof special_mention !== "object" || special_mention.length > 5)) return false;

  if (typeof is_negotiable !== 'boolean') return false;

  const isPrimaryDetailValid = validatePrimaryDetails(primaryDetails);;
  if (!isPrimaryDetailValid) return false;

  return true;
};

function validateUpdateAd(body, category, sub_category) {
  const {
    parent_id,
    description,
    SelectFields,
    special_mention,
    price,
    image_url,
    video_url,
    is_negotiable,
  } = body;

  if (typeof parent_id !== 'string' || parent_id.length !== 24) return false;

  if (!ValidateSelectFields({ cat: category, subCat: sub_category, selectFields: SelectFields })) return false

  if (typeof description !== 'string' || !description || description.length > 500) return false;

  if (typeof price !== 'number' || !price || price.length > 12) return false;

  if (typeof image_url !== 'object' || !image_url || !(image_url.length > 0 && image_url.length <= 10)) return false;

  if (!IsimageArrInvalid(image_url)) return false

  if (video_url && (typeof video_url !== 'object' || video_url.length > 2)) return false;

  if (!IsVideoArrInvalid(video_url)) return false

  if (special_mention && (typeof special_mention !== "object" || special_mention.length > 5)) return false;

  if (!ArrayOfString(special_mention, 40)) return false

  if (typeof is_negotiable !== 'boolean') return false;

  return true;
}

function validateFavoriteAdBody(body, adID) {
  const vals = ['Favourite', 'UnFavourite']
  if (!body.value || typeof body.value !== 'string' || !vals.includes(body.value)) return false
  if (!adID || typeof adID !== 'string' || adID.length !== 24) return false

  return true
};

function validateMongoID(adID) {
  if (!adID || typeof adID !== 'string' || adID.length !== 24) return false

  return true
};

function ValidateCreateAdBody(body) {
  const {
    ad_id,
    parent_id,
    category,
    sub_category,
    description,
    SelectFields, //TODO
    special_mention,
    title,
    price,
    image_url,
    video_url,
    ad_present_location,
    ad_posted_location,
    ad_posted_address,
    ad_present_address,
    ad_status,
    is_negotiable,
    AdsArray
  } = body;

  if (!validateMongoID(ad_id)) return false;

  if (!validateMongoID(parent_id)) return false;

  const catNames = Object.keys(catSubCat);
  if (!(catNames.includes(category) && catSubCat[category].includes(sub_category))) return false;

  if (!ValidateSelectFields({ cat: category, subCat: sub_category, selectFields: SelectFields })) return false

  if (typeof description !== 'string' || !description || description.length > 500) return false;

  if (typeof title !== 'string' || !title || title.length > 40) return false;

  if (typeof price !== 'number' || !price || price.length > 12) return false;

  if (typeof image_url !== 'object' || !image_url || !(image_url.length > 0 && image_url.length <= 10)) return false;

  if (!IsimageArrInvalid(image_url)) return false

  if (video_url && (typeof video_url !== 'object' || video_url.length > 2)) return false;

  if (!IsVideoArrInvalid(video_url)) return false

  if (typeof ad_present_address !== 'string' || !ad_present_address) return false;

  if (typeof ad_posted_address !== 'string' || !ad_posted_address) return false;

  const isPresentLocationValid = validateLocation(ad_present_location);
  if (!isPresentLocationValid) return false;

  const isPostedLocationValid = validateLocation(ad_posted_location);
  if (!isPostedLocationValid) return false;

  if (ad_status !== "Selling") return false;

  if (special_mention && (typeof special_mention !== "object" || special_mention.length > 5)) return false;

  if (!ArrayOfString(special_mention, 40)) return false

  if (typeof is_negotiable !== 'boolean') return false;

  if (!AdsArray || typeof AdsArray !== "object") {
    return false
  }
  if (typeof AdsArray.isPrime !== 'boolean' || typeof AdsArray.isHighlighted !== 'boolean' || typeof AdsArray.isBoosted !== 'boolean') {
    return false
  }

  return true;


};

function ValidateDraftAdBody(body) {
  const {
    ad_id,
    parent_id,
    category,
    sub_category,
    description,
    SelectFields, //TODO
    special_mention,
    title,
    price,
    image_url,
    video_url,
    is_negotiable
  } = body;

  if (!validateMongoID(ad_id)) return false;

  if (!validateMongoID(parent_id)) return false;

  const catNames = Object.keys(catSubCat);
  if (!(catNames.includes(category) && catSubCat[category].includes(sub_category))) return false;

  if (!ValidateSelectFields({ cat: category, subCat: sub_category, selectFields: SelectFields })) return false

  if (typeof description !== 'string' || !description || description.length > 500) return false;

  if (typeof title !== 'string' || !title || title.length > 40) return false;

  if (typeof price !== 'number' || !price || price.length > 12) return false;

  if (typeof image_url !== 'object' || !image_url || !(image_url.length > 0 && image_url.length <= 10)) return false;

  if (!IsimageArrInvalid(image_url)) return false

  if (video_url && (typeof video_url !== 'object' || video_url.length > 2)) return false;

  if (!IsVideoArrInvalid(video_url)) return false

  if (special_mention && (typeof special_mention !== "object" || special_mention.length > 5)) return false;

  if (!ArrayOfString(special_mention, 40)) return false

  if (typeof is_negotiable !== 'boolean') return false;

  return true;

};

function ArrayOfString(Array, strLength) {
  for (let i = 0; i < Array.length; i++) {
    if (typeof Array[i] !== 'string' || Array[i].length > strLength) return false
  }
  return true
};

function ValidateQuery(queries) {
  const {
    lng,
    lat,
    maxDistance
  } = queries;
  if (!lng || !lat) {
    return false
  }
  if (!maxDistance) {
    return false
  }

  return true
}

module.exports = {
  commonFieldSchema,
  validateBody,
  validateUpdateAd,
  validateFavoriteAdBody,
  validateMongoID,
  ValidateCreateAdBody,
  ValidateDraftAdBody,
  validateLocation,
  ArrayOfString,
  isImageInvalid,
  IsimageArrInvalid,
  ValidateQuery
};

