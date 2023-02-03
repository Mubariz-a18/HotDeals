const sharp = require('sharp');
const firebase = require('firebase-admin');
const { app } = require('./firebaseAppSetup');
const axios = require("axios")


const imageWaterMark = async () => {

    const imageUrls = [
        // "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2F0.05471868184294.jpg?alt=media&token=de9862da-8384-4f50-8180-bdd1f292640e"
        "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/postimages%2F1-201674189685243?alt=media&token=c2c407f5-e033-4894-bffa-e16f01aca125",
        // "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/postimage%2F12-211671602917505?alt=media&token=c403f01c-3df7-4ce4-b031-d3d9d9553be6"
    ];

    const storage = app.storage();

    const bucket = storage.bucket(process.env.BUCKETNAME);
    // Add watermark to each image

    async function addWatermark(url) {

        // Download the image
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const image = new Buffer.from(response.data, 'binary');


        // Add watermark to the image
        const watermarkedImage = await sharp(image)

            .composite([{ input: 'watermark.png', gravity: 'southeast' }])

            .toBuffer();


        const filename = url.substring(url.lastIndexOf('%2F') +3  , url.indexOf('?'));


        // Save the watermarked image to Firebase storage
        const newFile = bucket.file(`postimages/${filename}`);

        const stream = newFile.createWriteStream({

            metadata: {
                contentType: 'image/jpeg'
            }

        });

        stream.end(watermarkedImage);

    }

    // Process all images in parallel
    Promise.all(imageUrls.map(url => addWatermark(url)))
        .catch(err => {
            console.error(err);
        });

}




module.exports = imageWaterMark