const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    RatingInfo: [{
        _id:false,
        rating: Number,
        rating_given_by: String,
        rating_given_date: String
    }]
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
