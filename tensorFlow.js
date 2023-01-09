// Note: you do not need to import @tensorflow/tfjs here.
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');
const fs = require('fs');
const axios = require('axios');

/* ============================================================
  Function: Download Image
============================================================ */

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

(async () => {
  let example_image_3 = await download_image('https://npr.brightspotcdn.com/dims4/default/25c2427/2147483647/strip/true/crop/290x162+0+6/resize/280x156!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fwcbu%2Ffiles%2F201803%2FSexual-Harassment.jpg', 'images/image1.jpg');
})().then(async ()=>{
    const imageClassification = async path => {
        const image = readImage(path);
        const mobilenetModel = await mobilenet.load();
        const predictions = await mobilenetModel.classify(image);
        console.log('Classification Results:', predictions);
      }
    
    
    const readImage = path => {
        const imageBuffer = fs.readFileSync(path);
        const tfimage = tfnode.node.decodeImage(imageBuffer);
        return tfimage;
      }
      await imageClassification("./images/image1.jpg")
})

