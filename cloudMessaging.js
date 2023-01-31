const { app, getUserFromFireBase } = require("./firebaseAppSetup");
const moment = require("moment")

const messaging = app.messaging();

const db = app.database(process.env.DATABASEURL)

const cloudMessage = async (userId, messageData) => {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss.ms');

    const {
        title,
        body,
        data,
        type
    } = messageData

    const userData = await getUserFromFireBase(userId);

    const deviceTokens = [];

    if(userData.activeDevices){
        
        Object.keys(userData.activeDevices).forEach(function (key) {

            deviceTokens.push(userData.activeDevices[key].deviceToken);
    
        });
    }
    else{
        deviceTokens.push(userData.deviceToken)
    }


    const message = {

        tokens: deviceTokens,

        android: {
            notification: {
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
        },
        
        notification: {
            title: title,
            body: body
        },

        data:data
    };

    const messageSent = await messaging.sendMulticast(message);

    await db
        .ref("Notifications")
        .child(userId.toString())
        .push()
        .set(

            {
                "title": title,
                "content": body,
                "createdAt": currentDate,
                "data": data,
                'seenByUser': false,
                "type": type
            }

        )
    return messageSent

}

module.exports = cloudMessage