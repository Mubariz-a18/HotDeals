var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const moment = require("moment-timezone");

const Message = require("../models/message");
exports.postMessageController = async function (req, res) {
  try {
    let nDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Calcutta",
    });

    const date = nDate.split(",");
    console.log(date[0],date[1])


    var message = await new Message({
      sender: req.body.name,
      message: req.body.message,
      Date: date[0],
      Time: date[1],
    });

    var savedMessage = await message.save();
    console.log("saved");

    var censored = await Message.findOne({ message: "badword" });
    if (censored) await Message.remove({ _id: censored.id });
    else io.emit("message", req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.log("error", error);
  } finally {
    console.log("Message Posted");
  }
};
