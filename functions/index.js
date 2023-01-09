const functions = require('firebase-functions');
const path = require('path');
const fs = require('fs');

const tf = require('@tensorflow/tfjs-node');
const tfCore = require('@tensorflow/tfjs');

// const app = express();


let objectDetectionModel;
async function loadModel(fileName) {
    // Warm up the model
    if (!objectDetectionModel) {
      // Load the TensorFlow SavedModel through tfjs-node API. You can find more
      // details in the API documentation:
      // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel
      objectDetectionModel = await tf.node.loadSavedModel(
        './host/model/my_trained_model', ['serve'], 'serving_default');
    }
    
   try {
    const imageBuffer = fs.readFileSync(fileName);
    const tfImage = tf.node.decodeImage(imageBuffer);
    var resizedImage = tfCore.image.resizeBilinear(tfImage, [224, 224]);  
   
    const float32Cast = tf.cast(resizedImage, 'float32');
    const t4d = tf.tensor4d(Array.from(float32Cast.dataSync()),[1,224,224,3])

    var list = objectDetectionModel.predict(t4d).dataSync()
    var predictedList = list.toString().split(",")
    
    const writeResult = await admin.firestore().doc('devices/result').set({foundedItem: predictedList});

   } catch(err) {
        console.log(err);
   }
}


exports.modelInference = functions.storage.object().onFinalize(async (object) => {
    // [END generateThumbnailTrigger]
      // [START eventAttributes]
      const fileBucket = object.bucket; // The Storage bucket that contains the file.
      const filePath = object.name; // File path in the bucket.
      const contentType = object.contentType; // File content type.
      const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
      // [END eventAttributes]
    
      // [START stopConditions]
      // Exit if this is triggered on a file that is not an image.
      if (!contentType.startsWith('image/')) {
        return console.log('This is not an image.');
      }
    
      // Get the file name.
      const fileName = path.basename(filePath);
      
      // Download file from bucket.
      const bucket = admin.storage().bucket(fileBucket);
      const tempFilePath = path.join(os.tmpdir(), fileName);
      const metadata = {
        contentType: contentType,
      };


      await bucket.file(filePath).download({destination: tempFilePath});
      console.log('Image downloaded locally to', tempFilePath);
      console.log("IMAGE FILE PATH IS", tempFilePath)
      loadModel(tempFilePath)

      // Delete the local file to free up disk space.
      return fs.unlinkSync(tempFilePath);
      // [END thumbnailGeneration]
    });