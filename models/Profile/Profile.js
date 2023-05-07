
const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: [30, 'maximun 30 charecters']
  },
  userNumber: {
    text: {
      type: String,
      required: true,
      maxLength: [10, 'maximun 10 charecters']
    },
    private: {
      type: Boolean,
      default: true,
    },
  },
  date_of_birth: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  email: {
    text: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      default: "",
    },
    private: {
      type: Boolean,
      default: true,
    },
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  user_type: {
    text: {
      type: String,
      enum: ["Agent", "Owner", "Business"],
      default: "Owner",
    }
  },
  language_preference: {
    type: String,
    enum: [
      'English',
      'Hindi',
      'Gujarati',
      'Marathi',
      'Punjabi',
      'Bengali',
      'Odia',
      'Tamil',
      'Telugu',
      'Urdu',
      'Kannada',
      'Malayalam',
    ]
  },
  city: {
    text: {
      type: String,
      required: true,
      maxLength: [20, 'maximun 20 charecters'],
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
      maxLength: [200, 'maximun 200 charecters'],
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
  availble_credit: {
    type: Number,
  },
  premium_ad: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  profile_url: {
    type: String,
    required: true,
    match:/^(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/,
    default: "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/profileimages%2Fdefault_profile.jpg?alt=media&token=eca80b6f-a8a0-4968-9c29-daf57ee474bb"

  },
  thumbnail_url: {
    type: String,
    required: true,
    match:/^(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/,
    default: "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/profileimages%2Fdefault_profile.jpg?alt=media&token=eca80b6f-a8a0-4968-9c29-daf57ee474bb"
  },
  cover_photo_url: {
    type: String,
    match: /^(http|https):\/\/[a-z0-9\-_]+\.[a-z0-9\-_]+\.[a-z0-9\-_]{2,}$/i,
    default: ""
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
  referrered_user: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: Boolean,
    default: false,
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