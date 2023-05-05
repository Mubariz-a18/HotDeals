const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    user_id:{ 
        type: mongoose.Types.ObjectId
    },
    average_rating: {
        type:Number
    },
    RatingInfo: [{
        _id: false,
        rating:{
            type:Number,
            required:true,
            validate: {
                validator: function (v) {
                  return (v > 0 && v <= 5)
                },
                message: props => `${props.value} is not a valid rating!`
              }
        },
        comment:{
            type:String,
            maxLength: [100, 'maximun 100 charecters'],
            default:""
        },
        rating_given_by: mongoose.Types.ObjectId,
        rating_given_date: String,
        rating_updated_date: String
    }]
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
