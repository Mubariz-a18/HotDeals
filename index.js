require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const http = require("http");
const server = http.createServer(app);

// const httpServer = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const Conversation = require("./models/converstionSchema");
const User = require("./models/Users");
const router = require("./routes/index");
const profileRouter = require('./routes/profile.routes')
const AdRouter = require('./routes/ad.routes')
const AlertRouter = require('./routes/alert.routes')
const { findOne } = require("./models/converstionSchema");
const { application } = require("express");
// const chatController = require("./controllers/chatController").chatController;
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

(async () => {
  const uri = process.env.URL;
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose
      .connect(uri, connectionParams)
      .then(() => {
        console.log("Connected to the database ");
      })
      .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
      });
  } catch (err) {
    console.log("error: " + err);
  }
})();

app.use(profileRouter);
app.use(AdRouter);
app.use(AlertRouter)

app.use("/", router);

io.use(async (socket, next) => {
  const username = socket.handshake.auth.username;

  console.log("here" + username, socket.id);

  const usr = await User.findOne({
    socketID: socket.id,
  });
  if (!usr) {
    const createUser = await new User({
      name: username,
      socketID: socket.id,
    }).save();
  }
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }

  // console.log(users)
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  // forward the private message to the right recipient
  socket.on("private message", async ({ content, to }) => {
    const too = await User.findOne({
      socketID: to,
    });
    const cnvr = await new Conversation({
      to: too.name,
      from: socket.username,
      message: content,
      senderID: socket.id,
      receiverID: to,
    }).save();

    console.log(cnvr);
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
