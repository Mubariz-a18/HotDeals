const mongoose = require("mongoose");

// const AdSchema = mongoose.Schema({
//   category: {
//     type: String,
//     reqired: true,
//   },
//   sub_category: {
//     type: String,
//     required: true,
//   },
// });
// const Ad = mongoose.model('Ad',AdSchema);

const profileSchema = mongoose.Schema({
  // userID: {
  //   type: String,
  //   required: true,
  // },
  _id:{
    type:String
  },
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
    type: Date,
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
    },
    private: {
      type: Boolean,
      default: true,
    },
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
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  help_center: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  alert: [
    {
      type: mongoose.Schema.Types.ObjectId,
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
  premium_ad: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  display_email: {
    type: Boolean,
    default: false,
  },
  display_phone_number: {
    type: Boolean,
    default: false,
  },
  display_city: {
    type: Boolean,
    default: false,
  },
  display_about: {
    type: Boolean,
    default: false,
  },
  profile_url: {
    type: String,
  },
  help_center: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  follower_info: {
    type: Array
  },
  following_info: {
    type: Array
  },
  fcmToken: {
    type: String,
    default: "",
  },
  created_date:{
    type:String
  },
  updated_date:{
    type:String
  }
},
);

const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;
