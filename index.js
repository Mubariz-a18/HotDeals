require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const http = require("http");
const app = express();
const server = http.createServer(app);

//Router Imports
const authRouter = require("./routes/auth.routes");
const DashBoardRouter = require('./routes/home.routes')
const profileRouter = require("./routes/profile.routes");
const AdRouter = require("./routes/ad.routes");
const AlertRouter = require("./routes/alert.routes");
const ComplaintRouter = require("./routes/complaint.routes");
const HelpRouter = require("./routes/help.routes");
const CreditRouter = require("./routes/credit.routes");
const RatingRouter = require("./routes/rating.routes");
const followUnfollowRouter = require('./routes/follow_unfollow.routes');
const GlobalSearchRouter = require('./routes/global_search.routes');
const CatFieldsRouter = require('./routes/cat_fields.route')

//Middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');



const PORT = process.env.PORT || 3000;
//Connecting to MongoDB
const connectDB = require("./db/connectDatabase");
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
app.use(ComplaintRouter);
app.use(HelpRouter);
app.use(CreditRouter);
app.use(RatingRouter);
app.use(followUnfollowRouter);
app.use(DashBoardRouter);
app.use(GlobalSearchRouter);
app.use(CatFieldsRouter);



//server listener
server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
