const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
   follower_info:{
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    rating_given:{
        type:Number
    },
    rating_given_date:{
        type:Date
    },
    rating_updated_date:{
        type:Date
    },
   },
   following_info:{
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    rating_given:{
        type:Number
    },
    rating_given_date:{
        type:Date
    },
    rating_updated_date:{
        type:Date
    },
   }
   
  },
  { timestamps: true }
);

const Rating = mongoose.model('Rating',ratingSchema);
module.exports = Rating;
