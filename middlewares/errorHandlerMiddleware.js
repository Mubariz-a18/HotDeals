const { SERVER_ERR } = require("../validators/error");


//Middleware For Error Handling
const errorHandlerMiddleware = (err, req, res, next) => {
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
