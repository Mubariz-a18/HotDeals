require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const http = require("http");
const app = express();
const server = http.createServer(app);
// const io = require('socket.io')(server);

const io = require("socket.io")(server
  , {
    cors: {
      origin: "http://localhost:8080",
    },
  }
);


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
const scheduleTask = require('./CronJob/cronJob')
const { application } = require("express");

const PORT = process.env.PORT || 3000;
//Connecting to MongoDB
connectDB();
// scheduleTask();

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


server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
