const { createWorker } = require('tesseract.js');
const emailRegex = require('regex-email');
const urlRegex = require('regex-url');
const phone = require('phone');
const axios = require('axios');
const fs = require('fs');

module.exports = (async () => {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const response = await axios.get('https://blog.hubspot.com/hs-fs/hubfs/Parts%20of%20a%20URL.png?width=650&name=Parts%20of%20a%20URL.png', {
        responseType: 'arraybuffer'
    });
    fs.writeFileSync('image.jpg', new Buffer.from(response.data));

    let { data: { text } } = await worker.recognize('image.jpg');
    text = text.toString()


    // const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    // const urlRegex = /(https?:\/\/[^\s]+)/;
    // const phoneRegex = /\+[0-9]{1,3}-[0-9]{3}-[0-9]{3}-[0-9]{4}/;
    const instagramRegex = /@[a-zA-Z0-9._]+/;

    const emailRegex = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const phoneRegex = text.match(/\+[0-9]{1,3}-[0-9]{3}-[0-9]{3}-[0-9]{4}/);
    const urlRegex = text.match(/(https?:\/\/[^\s]+)/);
    console.log(emailRegex,urlRegex,phoneRegex)
    // const emailMatches = text.match(emailRegex);
    // const urlMatches = text.match(urlRegex);
    // const phoneMatches = phone.phone(phoneRegex)


    // console.log(emailMatches, urlMatches, phoneMatches)
    await worker.terminate();
})();