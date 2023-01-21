const request = require('request-promise-native');
const sharp = require('sharp');
const firebase = require("firebase-admin");
const { initializeApp } = require("firebase/app");
var creds = require("./googleVisionKeys.json");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");


const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
};


async function imgCom(imageUrl) {
    try {

        const app = firebase.initializeApp({

            credential: firebase.credential.cert(creds),

            storageBucket: process.env.STORAGEBUCKET
        });

        const storage = app.storage();

        const bucket = storage.bucket("true-list.appspot.com")

        const thumbnailName = `${Math.random().toFixed(16) * 10}.jpg`

        const thumbnailLocation = `thumbnails/${thumbnailName}`

        // image data
        const imageData = await request({

            url: imageUrl,
            encoding: null

        });

        // Use sharp to resize the image
        const resizedImage = await sharp(imageData)
            .resize(800, 600)
            .toBuffer();

        // Save image to Firebase storage
        const file = bucket.file(thumbnailLocation);

        await file.save(await resizedImage, {
            metadata: {
                contentType: 'image/jpeg'
            }
        });

        // returning url from firebase app

        const firebaseApp = initializeApp(firebaseConfig);

        const firebaseStorage = getStorage(firebaseApp);

        const pathReference = ref(firebaseStorage, thumbnailLocation);

        const imageThumbnailUrl = await getDownloadURL(pathReference)

        return imageThumbnailUrl

    } catch (e) {

        console.log(e)
    }

}



module.exports = imgCom
