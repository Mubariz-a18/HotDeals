const vision = require('@google-cloud/vision');
const Filter = require('bad-words');
const badWords = require('../utils/badWords');

const client = new vision.ImageAnnotatorClient({
    keyFilename: "googleVisionKeys.json"
});

function loopingDetection(batch) {
    let values = [];
    for (const obj of batch) {
        for (const [key, value] of Object.entries(obj)) {
            values.push(value)
        }
    }

    let FLAGS = ["POSSIBLY", "LIKELY", "VERY_LIKELY"];

    let result = FLAGS.some(i => values.includes(i));

    if (result == true)
        return "HARMFULL"
    else {
        return "HEALTHY"
    }

}

// const loopingTextDetection = (textArray)=>{

//         const emailRegex = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
//         const phoneRegex = text.match(/\+[0-9]{1,3}-[0-9]{3}-[0-9]{3}-[0-9]{4}/);
//         const urlRegex  = text.match(/(https?:\/\/[^\s]+)/);
//         if(emailRegex || phoneRegex || urlRegex){
//             flag = true
//         }
//         console.log(flag)

// }


async function detectSafeSearch(imageArray) {
    const images = imageArray.map(uri => ({ source: { imageUri: uri } }))

    const request = {
        requests: images.map(image => ({
            image,
            features: [{ type: 'SAFE_SEARCH_DETECTION' }]
        }))
    }
    const [response] = await client.batchAnnotateImages(request);

    const batch = []

    response.responses.forEach(annotation => {
        batch.push(annotation.safeSearchAnnotation)
    })

    let myFilterArray = []
    batch.forEach(elements => {
        if (elements !== null) {
            myFilterArray.push(elements);
        }
    });
    const health = loopingDetection(myFilterArray)
    return { health, batch }
}


// async function detectsafeText(imageArray) {

//     const detectionsPromises = imageArray.map(async (imageUrl) => {

//         const [result] = await client.textDetection(imageUrl);

//         return result.textAnnotations[0].description;
//     });

//     Promise.all(detectionsPromises)

//         .then((detections) => {

//             const emailRegex = detections[0].match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
//             const phoneRegex = detections[0].match(/\+[0-9]{1,3}-[0-9]{3}-[0-9]{3}-[0-9]{4}/);
//             const urlRegex = detections[0].match(/(https?:\/\/[^\s]+)/);

//             console.log(detections[0])
//             console.log(emailRegex, phoneRegex, urlRegex)
//         })

//         .catch((error) => {

//             console.error(error);
//         });
// }


async function safetext(title, description , special_mention) {

    const filter = new Filter();

    filter.addWords(...badWords);

    const isTitleBad = filter.isProfane(title);

    const isDescriptionBad = filter.isProfane(description);

    const isSpecialMentionsBAd  = filter.isProfane(special_mention);

    if (isTitleBad === true || isDescriptionBad === true || isSpecialMentionsBAd === true) {
        return "HarmFull"
    }
    else {
        return "NotHarmFull"
    }
}



module.exports = { detectSafeSearch, safetext }