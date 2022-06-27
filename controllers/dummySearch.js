const DummyData = require("../models/dummySchema");

exports.dummySearchController = async function (req, res) {
  try {
    console.log("reached here");
    console.log(req.body);

    const dmyData = await new DummyData(req.body).save();
    console.log(dmyData);
  } catch (error) {}
};
