const request = require('request-promise-native');
const sharp = require('sharp');
const firebase = require("firebase-admin");
const creds = require("./googleVisionKeys.json");
async function imgCom(imageUrl) {
    try {

        const app = firebase.initializeApp({

            credential: firebase.credential.cert(creds),

            storageBucket: process.env.STORAGEBUCKET
        });

        const storage = app.storage();

        const bucket = storage.bucket(process.env.BUCKETNAME);

        const thumbnailName = `${Math.random().toFixed(16) * 10}.jpg`;

        const thumbnailLocation = `thumbnails/${thumbnailName}`;

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

        await file.save(resizedImage, {
            metadata: {
                contentType: 'image/jpeg'
            }
        });

        // returning url from firebase app

        const imageThumbnailUrl = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        });
        return imageThumbnailUrl;

    } catch (e) {
        console.log(e);
    }

}



module.exports = imgCom
