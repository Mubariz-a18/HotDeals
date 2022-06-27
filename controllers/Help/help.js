const Help = require('../../models/helpCenterSchema');

exports.helpCenterController = async function(req,res){
    try {
        console.log("inside help center");
        console.log(req.userId);

        const msg = req.body.message;

        const help = await new Help({
            user_id:req.userId,
            phone_number:req.body.phone_number,
            title:req.body.title,
            description:req.body.description,
            attachment:req.body.attachment,
            message:msg
        }).save();

        console.log(help)
    } catch (error) {
        
    }
}