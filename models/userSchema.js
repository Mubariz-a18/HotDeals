const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  Name: {
    type: String,
  },
  email: {
    type: String,
  },
});
