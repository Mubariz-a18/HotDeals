const DummyData = require("../models/dummySchema");

exports.getDummySearchController = async function (req, res) {
  try {
    console.log("reached here" + req.query.name);
    let about = req.query.about;
    let name = req.query.name;
    // const result = await DummyData.find({about:{$regex:q,$options:"i"}});
    if (name && about) {
      const result = await DummyData.find({
        $or: [
          { about: { $regex: about, $options: "i" } },
          { name: { $regex: name, $options: "i" } },
        ],
      });
      res.json(result);
    }
    if (about) {
      const result = await DummyData.find({
        about: { $regex: about, $options: "i" },
      });
      res.json(result);
    } else if (name) {
      const result = await DummyData.find({
        name: { $regex: name, $options: "i" },
      });
      res.json(result);
    }

    // res.json(result);
    console.log(result);
  } catch (error) {}
};
