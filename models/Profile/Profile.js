
const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  name: {
    type: String,
  },
  userNumber: {
    text: {
      type: String,
      default: "",
    },
    private: {
      type: Boolean,
      default: true,
    },
  },
  country_code: {
    type: String,
  },
  date_of_birth: {
    type: String,
  },
  email: {
    text: {
      type: String,
      default: "",
    },
    private: {
      type: Boolean,
      default: true,
    },
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  user_type: {
    text: {
      type: String,
      enum: ["Agent", "Owner"],
      default: "Owner",
    }
  },
  language_preference: {
    type: String,
  },
  city: {
    text: {
      type: String,
      default: "",
    },
    private: {
      type: Boolean,
      default: true,
    },
  },
  about: {
    text: {
      type: String,
      default: "",
    },
    private: {
      type: Boolean,
      default: true,
    },
  },
  is_phone_verified: {
    type: Boolean,
    default: false,
  },
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  is_aadhar_verified: {
    type: Boolean,
    default: false,
  },
  is_profile_update: {
    type: Boolean,
    default: false,
  },
  my_ads: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  favourite_ads: [
    {
      _id: false,
      ad_id: mongoose.Schema.Types.ObjectId,
      ad_Favourite_Date: String
    },
  ],
  help_center: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  alert: [
    {
      _id: false,
      alert_id: mongoose.Schema.Types.ObjectId,
      alerted_Ads: [
        {
          type: mongoose.Schema.Types.ObjectId
        }
      ],
      alert_Expire_Date: String
    },
  ],
  report: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  free_credit: {
    type: Number,
  },
  premium_credit: {
    type: Number,
  },
  free_boost_credit: {
    type: Number,
  },
  premium_boost_credit: {
    type: Number,
  },
  highlight_credits: {
    type: Number,
  },
  premium_ad: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  profile_url: {
    type: String
  },
  thumbnail_url:{
    type:String
  },
  cover_photo_url: {
    type: String
  },
  followers: Array,
  followers_count: {
    type: Number,
    default: 0
  },
  followings: Array,
  followings_count: {
    type: Number,
    default: 0
  },
  is_recommended: {
    type: Boolean,
    default: false
  },
  rate_count: {
    type: Number,
    default: 0
  },
  rate_average: {
    type: Number,
    default: 0
  },
  fcmToken: {
    type: String,
    default: "",
  },
  user_Banned_Flag: {
    type: Boolean
  },
  user_Banned_Times: {
    type: Number
  },
  user_Banned_Date: {
    type: String
  },
  created_date: {
    type: String
  },
  updated_date: {
    type: String
  }
},
);

const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;