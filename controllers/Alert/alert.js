const Alert = require("../../models/alertSchema");
const User = require("../../models/Profile/Profile");

exports.alertController = async function (req, res) {
  try {
    console.log("inside alert controller");
    console.log(req.body);

    const usr = await User.findOne({ _id: req.userId });

    const alrt = await new Alert({
      user_id: req.userId,
      category: req.body.category,
      sub_category: req.body.sub_category,
      name: req.body.name,
      keyword: req.body.keyword,
      activate_status: req.body.activate_status,
    }).save();

    console.log(alrt);
  } catch (error) {}
};
