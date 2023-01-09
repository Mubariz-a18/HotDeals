// const functions = require('firebase-functions');
const path = require('path');
const fs = require('fs');

const tf = require('@tensorflow/tfjs-node');
const tfCore = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');

let objectDetectionModel;
async function loadModel(fileName) {
  
   try {
    const imageBuffer = fs.readFileSync(fileName);
    const tfImage = tf.node.decodeImage(imageBuffer);
    var resizedImage = tfCore.image.resizeBilinear(tfImage, [224, 224]);  
   
    const float32Cast = tf.cast(resizedImage, 'float32');
    const t4d = tf.tensor4d(Array.from(float32Cast.dataSync()),[1,224,224,3])

    var list = objectDetectionModel.predict(t4d).dataSync()
    var predictedList = list.toString().split(",")
    console.log(predictedList)
    
    // const writeResult = await admin.firestore().doc('devices/result').set({foundedItem: predictedList});

   } catch(err) {
        console.log(err);
   }
}


exports.modelInference =(async () => {
    //   const fileBucket = object.bucket; 
      const filePath = "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGljfGVufDB8fDB8fA%3D%3D&w=1000&q=80"; 
    //   const contentType = object.contentType; 
    //   const metageneration = object.metageneration; 
      // [END eventAttributes]
    
      // [START stopConditions]
      // Exit if this is triggered on a file that is not an image.
    //   if (!contentType.startsWith('image/')) {
    //     return console.log('This is not an image.');
    //   }
    
      // Get the file name.
      const fileName = path.basename(filePath);
      
      // Download file from bucket.
    //   const bucket = admin.storage().bucket(fileBucket);
      const tempFilePath = path.join(os.tmpdir(), fileName);
    //   const metadata = {
    //     contentType: contentType,
    //   };


    //   await bucket.file(filePath).download({destination: tempFilePath});
    //   console.log('Image downloaded locally to', tempFilePath);
    //   console.log("IMAGE FILE PATH IS", tempFilePath)
      loadModel(tempFilePath)

      // Delete the local file to free up disk space.
      return fs.unlinkSync(tempFilePath);
      // [END thumbnailGeneration]
    });