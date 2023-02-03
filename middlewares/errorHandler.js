
const errorHandler = (e,res)=>{
    if (!e.status) {
        res.status(500).json({
            error: {
                message: ` something went wrong try again : ${e.message} `
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