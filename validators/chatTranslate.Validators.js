const languagesList = [
    "hi", "ta", "te", "ur", "kn", "ml", "mr", "bn", "gu"
];
const validateTranslateBody = (body)=>{
    const {
        text,
        language
    } = body;
    if(!text || !language) return false;
    if(typeof text !== 'string'||typeof language !== 'string') return false;
    if(text.length > 300) return false
    if(!languagesList.includes(language)) return false;
    return true;
}

module.exports = validateTranslateBody;