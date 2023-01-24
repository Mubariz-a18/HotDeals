const firebase = require("firebase-admin");
const creds = require("./googleVisionKeys.json");

const app = firebase.initializeApp({

    credential: firebase.credential.cert(creds),

    storageBucket: process.env.STORAGEBUCKET
});

const getUserFromFireBase = async (userId) => {

    const db = app.database(process.env.DATABASEURL);

    const userRef = db.ref(`Users/${userId}`);

    const snapshot = await userRef.once('value')

    const userData = await snapshot.val();

    return userData

}

module.exports = { app, getUserFromFireBase }