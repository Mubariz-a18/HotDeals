const Complain = require("../../models/complainSchema");
const User = require("../../models/Profile/userProfile");
exports.ComplainController = async function (req, res) {
  try {
    console.log("inside complain ");
    console.log(req.body);

    const usr = await User.findOne({
      _id: req.userId,
    });

    const complain = req.body.complain;

    const cpln = await new Complain({
        user_id:req.userId,
        complain:complain,
        description:req.body.description    
    }).save();

    console.log(cpln)
  } catch (error) {}
};
