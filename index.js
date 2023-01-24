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
const { } = require("./CronJob/cronJob");
const ReportRouter = require("./routes/report.routes");
const JsonRouter = require('./routes/jsonData.routes')
//Middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');


const PORT = process.env.PORT || 3000;
//Connecting to MongoDB
const connectDB = require("./db/connectDatabase");
const cloudMessage = require("./cloudMessaging");
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
app.use(JsonRouter)
app.use(ReportRouter)

//server listener
app.listen(PORT, () => {
  console.log(`server is running On port : ${PORT}`)
});