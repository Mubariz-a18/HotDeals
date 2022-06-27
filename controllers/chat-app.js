const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const ChatUser  = require("../models/message")
exports.chat_app = async function (req, res) {
  try {
    io.on("connection",async (socket) => {
      socket.on("disconnect", () => {
        io.emit("send message", {
          message: `${socket.username} has left the chat`,
          user: "Welcome Bot",
        });
      });

      socket.on("new message",async (msg) => {
        console.log(msg);
        io.emit("send message", { message: msg, user: socket.username });
      });

      socket.on("new user",async (usr) => {

        socket.username = usr;
        io.emit("send message", {
          message: `${socket.username} has joined the chat`,
          user: "Welcome",
        });
      });
    });
  } catch (error) {}
};
