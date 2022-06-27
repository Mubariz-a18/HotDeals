const Message = require("../models/message");

exports.getMessageController = async function (req, res) {
  try {
    console.log("reached here");

    const getMsg = await Message.find({})

    res.send({
        statusCode:"200",
        msg:getMsg
    })

    console.log(sampleData);

      
  } catch (error) {}
};
