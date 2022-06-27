const Sample = require("../models/sample");
exports.postSampleController = async function (req, res) {
  try {
    console.log("reached here");
    console.log(req.body);
    const sampleData = await new Sample(req.body);

    console.log(sampleData);

    sampleData
      .save()
      .then((item) => {
        res.send("item saved to database");
      })
      .catch((err) => {
        res.status(400).send("unable to save to database");
      });

  } catch (error) {}
};
