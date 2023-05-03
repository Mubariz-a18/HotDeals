
const errorHandler = (e,res)=>{
    console.log(e)
    if (!e.status) {
        res.status(500).json({
            error: {
                message:  e.message.includes("validation failed") ? 'Please fill the required field': ` something went wrong try again : ${e.message} `
            }
        });
    } else {
        res.status(e.status).json({
            error: {
                message: e.message
            }
        });
    };
}


module.exports = errorHandler