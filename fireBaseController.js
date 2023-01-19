
const { initializeApp } = require("firebase/app");
const { getStorage, ref, deleteObject } = require("firebase/storage")

// TODO: Add SDKs for Firebase products that you want to use


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

async function deleteFileFromStorage(image) {
    const desertRef = ref(storage, `${image}`)
    deleteObject(desertRef).then(() => {

    }).catch(e => {
        console.log(e)
    })
}



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


module.exports = deleteFileFromStorage