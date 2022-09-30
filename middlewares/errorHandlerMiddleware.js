const { SERVER_ERR } = require("../error");


//Middleware For Error Handling
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("inside errorHandlerMiddleware")
  console.log(err);
  const status = err.status || 500;
  const message = err.message || SERVER_ERR;
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
};


module.exports = errorHandlerMiddleware;
