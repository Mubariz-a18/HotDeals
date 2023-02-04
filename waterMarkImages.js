const sharp = require('sharp');
const firebase = require('firebase-admin');
const { app } = require('./firebaseAppSetup');
const axios = require("axios")


const imageWaterMark = async (imageArray) => {
    const imageUrls = imageArray;
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