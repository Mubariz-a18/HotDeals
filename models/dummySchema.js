const mongoose = require("mongoose");

const dummySchema = mongoose.Schema({
  age: {
    type: String,
    requird: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
    text:true
  },
  gender: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
    index: true,
    text:true
  },
});
dummySchema.index({ name: "text", about: "text" });
const DummyData = mongoose.model("DummyData", dummySchema);

module.exports = DummyData;
