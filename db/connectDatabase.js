const mongoose = require("mongoose");
const db = process.env.URL;
const connectDB = async () => {
  await mongoose
    .connect(db, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log("database is connected  ", db)
    })
    .catch((err) => {
      console.error("Error connecting to mongo", err);
    });
  return mongoose;
};

module.exports = connectDB;
