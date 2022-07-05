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
  name: {
    type: String,
  },
  userNumber: {
    type: String,
    unique: true,
  },
  country_code: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  user_type: {
    type: String,
    enum: ["Agent", "Owner"],
    default: "Owner",
  },
  language_preference: {
    type: String,
  },
  city: {
    type: String,
  },
  about: {
    type: String,
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
});

const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;
