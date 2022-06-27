const Sample = require("../models/sample");

exports.getSampleController = async function (req, res) {
  try {
    console.log("reached here");

    const sampleData = await Sample.find({})

    res.send({
        statusCode:"200",
        data:sampleData
    })

    console.log(sampleData);

      
  } catch (error) {}
};
