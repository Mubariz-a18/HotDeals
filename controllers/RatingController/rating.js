const User = require("../../models/Profile/Profile");
const Rating = require("../../models/ratingSchema");

exports.rating_given = async function (req, res) {
  try {
    console.log("reached herer");
    console.log(req.body);

    const user = await User.findOne({
      _id: req.userId,
    });

    console.log(user);
    const follower_info = req.body.follower_info;
    console.log(follower_info);
    const following_info = req.body.following_info;
    console.log(following_info);

    const rating = await new Rating({
      user_id: req.userId,
      follower_info:follower_info,
      following_info:following_info
    }).save();
    console.log(rating)

  } catch (error) {}
};
