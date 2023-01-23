const firebase = require("firebase-admin");
const creds = require("./googleVisionKeys.json");

const app = firebase.initializeApp({

    credential: firebase.credential.cert(creds),

    storageBucket: process.env.STORAGEBUCKET
});

module.exports = app