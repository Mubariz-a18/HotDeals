require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Sentry = require("@sentry/node");

const Tracing = require("@sentry/tracing");

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

//Router Imports
const router = require("./routes/index");
const profileRouter = require("./routes/profile.routes");
const AdRouter = require("./routes/ad.routes");
const AlertRouter = require("./routes/alert.routes");
const ComplainRouter = require("./routes/complain.routes");
const HelpRouter = require("./routes/help.routes");
const CreditRouter = require("./routes/credit.routes");
const RatingRouter = require("./routes/rating.routes");

const connectDB = require('./db/connectDatabase')

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//Connecting to MongoDB
connectDB();

Sentry.init({
  dsn: "https://c2ca7fe1eec14039b1874d3b84b406bf@o1302266.ingest.sentry.io/6539457",

  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({
      // to trace all requests to the default router
      app,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
  ],
  tracesSampleRate: 1.0,
});

//Sentry Middlewares

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());


app.use(profileRouter);
app.use(AdRouter);
app.use(AlertRouter);
app.use(ComplainRouter);
app.use(HelpRouter);
app.use(CreditRouter);
app.use(RatingRouter);

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
