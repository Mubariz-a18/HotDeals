require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();

//Router Imports
const authRouter = require("./routes/auth.routes");
// const DashBoardRouter = require('./routes/home.routes')
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
const {} = require("./CronJob/cronJob");

//Middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');


const PORT = process.env.PORT || 3000;
//Connecting to MongoDB
const connectDB = require("./db/connectDatabase");
connectDB();

/*  
      express-rate limiter for limiting the user to hit an end point to certain number of times before giving error 
*/


// const rateLimit = require('express-rate-limit')

// const limiter = rateLimit({
// 	windowMs: 1 * 60 * 1000, // 15 minutes
// 	max: 5, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
//   message:
// 		'Too many  please try again after an 15 min',
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// })

// Apply the rate limiting middleware to all requests
// app.use(limiter)

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
// app.use(DashBoardRouter);
app.use(GlobalSearchRouter);
app.use(cat_subCat_SearchRouter);

//server listener
app.listen(PORT, () => {
  console.log(`server is running On port : ${PORT}`)
});
