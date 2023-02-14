require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();

//Router Imports
const authRouter = require("./routes/auth.routes");
const profileRouter = require("./routes/profile.routes");
const AdRouter = require("./routes/ad.routes");
const AlertRouter = require("./routes/alert.routes");
const ComplaintRouter = require("./routes/complaint.routes");
const HelpRouter = require("./routes/help.routes");
const CreditRouter = require("./routes/credit.routes");
const RatingRouter = require("./routes/rating.routes");
const followUnfollowRouter = require('./routes/follow_unfollow.routes');
const GlobalSearchRouter = require('./routes/global_search.routes');
const { Schedule_Task_Alert_6am_to_10pm,Schedule_Task_Monthly_credits } = require("./CronJob/cronJob");
const ReportRouter = require("./routes/report.routes");
const JsonRouter = require('./routes/jsonData.routes');
const ReferCodeRouter = require("./routes/referral.routes");
const TransactionRouter = require("./routes/transaction.routes");
const SuggestionRouter = require('./routes/suggestion.routes');
//Middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');


const PORT = process.env.PORT || 3000;
//Connecting to MongoDB
const connectDB = require("./db/connectDatabase");
connectDB();

app.set('trust proxy', 1)

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
app.use(GlobalSearchRouter);
app.use(JsonRouter);
app.use(ReportRouter);
app.use(ReferCodeRouter);
app.use(TransactionRouter);
app.use(SuggestionRouter);

//server listener
app.listen(PORT, () => {
  console.log(`server is running On port : ${PORT}`)
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message, error.stack, error.name);
});