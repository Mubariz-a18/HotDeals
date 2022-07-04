const User = require("../../models/Profile/Profile");

exports.petValidation = async function (req, res, next) {
  try {
    console.log("inside middleware");

    console.log(typeof req.body.category);

    if (!req.body.category) {
      return res.status(404).send({
        error: "Please provide category",
      });
    }

    if (typeof req.body.category != "String") {
      return res.status(404).send({
        error: "Category should be a String",
      });
    }
  } catch (error) {}
};
