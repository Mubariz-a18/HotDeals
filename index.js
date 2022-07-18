require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// const io = require("socket.io")(server
//   , {
//     cors: {
//       origin: "http://localhost:8080",
//     },
//   }
// );


//Router Imports
const router = require("./routes/index");
const authRouter = require("./routes/auth.routes");
const DashBoardRouter = require('./routes/home.routes')
const profileRouter = require("./routes/profile.routes");
const AdRouter = require("./routes/ad.routes");
const AlertRouter = require("./routes/alert.routes");
const ComplainRouter = require("./routes/complain.routes");
const HelpRouter = require("./routes/help.routes");
const CreditRouter = require("./routes/credit.routes");
const RatingRouter = require("./routes/rating.routes");
const followUnfollowRouter = require('./routes/follow_unfollow.routes');
const GlobalSearchRouter = require('./routes/global_search.routes');
// const ChatRouter = require('./routes/chat.routes')

//Middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

const connectDB = require("./db/connectDatabase");
const { application } = require("express");

const PORT = process.env.PORT || 3000;
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

//Middlewares
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(errorHandlerMiddleware)

//Routers
app.use(authRouter);
app.use(profileRouter);
app.use(AdRouter);
app.use(AlertRouter);
app.use(ComplainRouter);
app.use(HelpRouter);
app.use(CreditRouter);
app.use(RatingRouter);
app.use(followUnfollowRouter);
app.use(DashBoardRouter);
app.use(GlobalSearchRouter);
// app.use(ChatRouter)

// app.use("/", router);

// app.get('/', (req, res) => {
//   res.send('successfully reached')
// })


// io.use(async (socket, next) => {
//   console.log("Reached to server")
//   const username = await socket.handshake.auth.username;

//   console.log("here" + username, socket.id);

//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.username = username;
//   next();
// });

// io.on("connection", (socket) => {
//   console.log("I'm herer" +socket.username)
//   console.log('socket is ready for connection');
//   socket.on("connect", () => {
//     console.log("user connected!!")
//     socket.broadcast.emit("user disconnected", socket.id);
//   });
//   // fetch existing users
//   const users = [];
//   for (let [id, socket] of io.of("/").sockets) {
//     users.push({
//       userID: id,
//       username: socket.username,
//     });
//   }

//   // console.log(users)
//   socket.emit("users", users);

//   // notify existing users
//   socket.broadcast.emit("user connected", {
//     userID: socket.id,
//     username: socket.username,
//   });

//   // forward the private message to the right recipient
//   socket.on("private message", async ({ content, to }) => {

//     socket.to(to).emit("private message", {
//       content,
//       from: socket.id,
//     });
//   });

//   // notify users upon disconnection
//   socket.on("disconnect", () => {
//     socket.broadcast.emit("user disconnected", socket.id);
//   });
// });




//FLUTTER CHAT CODE
io.on('connection', socket => {
  console.log(socket.id)
  console.log('Connection to client established');
  
  //Get the chatID of the user and join in a room of the same chatID
  // chatID = socket.handshake.query.chatID
  // socket.join(chatID)

  //Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    console.log("user disconnected")
      // socket.leave(chatID)
  })

  // //Send message to only a particular user
  // socket.on('send_message', message => {
  //     receiverChatID = message.receiverChatID
  //     senderChatID = message.senderChatID
  //     content = message.content

  //     //Send message to only that particular room
  //     socket.in(receiverChatID).emit('receive_message', {
  //         'content': content,
  //         'senderChatID': senderChatID,
  //         'receiverChatID':receiverChatID,
  //     })
  // })
});


server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
