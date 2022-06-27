const mongoose = require('mongoose');

const sampleSchema = mongoose.Schema({
 firstName:{
    type:String
 },
 phoneNumber:{
    type:String
 },
 gender:{
    type:String
 }
});
const Sample = mongoose.model('Sample', sampleSchema);

module.exports = Sample;