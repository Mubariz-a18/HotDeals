const CreditValuesModel = require("../models/creditvaluesSchema");
const JsonCreditModel = require("../models/jsonCreditScehma");
// const JsonLangMapModel = require("../models/jsonLanMap");
const JsonVersionModel = require("../models/jsonVersions");
// const JsonDataModel = require("./../models/jsonDataSchema");
const { default: axios } = require("axios");

module.exports = class JsonDataService {

    static async getJsonData() {
        const JsonCredits = await JsonCreditModel.findOne();
        const Versions = await JsonVersionModel.findOne();
        const CreditValues = await CreditValuesModel.findOne();
        const { businessAdMultiplier, businessAdBaseCreditValue } = CreditValues;
        for (const key in businessAdMultiplier) {
            if (businessAdMultiplier.hasOwnProperty(key)) {
                businessAdMultiplier[key] = businessAdMultiplier[key] * businessAdBaseCreditValue;
            }
        };
        return {
            JsonCredits,
            businessAdMultiplier,
            Versions
        };
    }

    static async getPlaces(input) {
        const key = process.env.GOOGLEAPIKEY;
        const token = Math.floor(Date.now() / 1000);
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${key}&sessiontoken=${token}&components=country:in`);
            return response?.data
        } catch (e) {
            ({ status: 400, message: 'Bad Request' })
        }
    }

};