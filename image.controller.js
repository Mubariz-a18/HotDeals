const vision = require('@google-cloud/vision');

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

module.exports = detectSafeSearch