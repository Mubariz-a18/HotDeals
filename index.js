require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

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
const cat_subCat_SearchRouter = require('./routes/cat_subCat_search.routes')

//Middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');



const PORT = process.env.PORT || 3000;
//Connecting to MongoDB
const connectDB = require("./db/connectDatabase");
const ScheduleTask = require("./CronJob/cronJob");
connectDB();

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
app.use(cat_subCat_SearchRouter);

//server listener
server.listen(PORT, () => {
  ScheduleTask
});
