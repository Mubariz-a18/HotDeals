const Ad = require("../../../models/Ads/adSchema");

exports.searchAds = async function (req, res) {
  try {
    console.log("inside search controller");
    let description = req.query.description;


    let searchContent = req.query.searchContent;

    const ads = await Ad.find({$text: { $search:searchContent } })

    // console.log(ads)

    // const result = await Ad.find({
    //   $or: [
    //     { category: { $regex: category, $options: "i" } },
    //     { sub_category: { $regex: sub_category, $options: "i" } },
    //   ],
    // });

    // console.log(ads);
    res.status(200).send({
      count: ads.length,
      results: ads,
    });
  } catch (error) {}
};
