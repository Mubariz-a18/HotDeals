const JsonCreditModel = require("../models/jsonCreditScehma");
// const JsonLangMapModel = require("../models/jsonLanMap");
const JsonVersionModel = require("../models/jsonVersions");
// const JsonDataModel = require("./../models/jsonDataSchema");
const { default: axios } = require("axios");

module.exports = class JsonDataService {

    static async getJsonData() {
        // const JsonData = await JsonDataModel.findOne();
        const JsonCredits = await JsonCreditModel.findOne();
        // const JsonLang = await JsonLangMapModel.findOne();
        const Versions = await JsonVersionModel.findOne();
        return {
            // JsonData,
            JsonCredits,
            // JsonLang,
            Versions
        }
    }

    static async getPlaces(input) {
        const key = process.env.GOOGLEAPIKEY;
        const token = Math.floor(Date.now() / 1000);
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${key}&sessiontoken=${token}&components=country:in`);
        return response?.data
    }

};