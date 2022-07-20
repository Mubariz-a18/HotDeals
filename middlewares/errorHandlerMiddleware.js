const { SERVER_ERR } = require("../error");

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

// // Setup the Express global error handler.
// app.use(
// 	function( error, request, response, next ) {

// 		console.log( chalk.red.bold( "ERROR" ) );
// 		console.log( chalk.red.bold( "=====" ) );
// 		console.log( error );

// 		// Because we hooking post-response processing into the global error handler, we
// 		// get to leverage unified logging and error handling; but, it means the response
// 		// may have already been committed, since we don't know if the error was thrown
// 		// PRE or POST response. As such, we have to check to see if the response has
// 		// been committed before we attempt to send anything to the user.
// 		if ( ! response.headersSent ) {

// 			response
// 				.status( 500 )
// 				.send( "Sorry - something went wrong. We're digging into it." )
// 			;

// 		}

// 	}
// );

module.exports = errorHandlerMiddleware;
