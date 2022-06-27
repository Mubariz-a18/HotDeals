const mongoose = require('mongoose');

const creditSchema = mongoose.Schema({
    user_id:[{
        type:mongoose.Schema.Types.ObjectId,
    }],
    credit_type:{
        type:String,
        default:"premium"
    },
    transcation_id:{
        ty
    }
})