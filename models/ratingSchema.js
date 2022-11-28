const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    average_rating: Number,
    RatingInfo: [{
        _id: false,
        rating: Number,
        rating_given_by: mongoose.Types.ObjectId,
        rating_given_date: String,
        rating_updated_date: String
    }]
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
