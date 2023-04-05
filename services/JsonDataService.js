const JsonCreditModel = require("../models/jsonCreditScehma");
// const JsonLangMapModel = require("../models/jsonLanMap");
const JsonVersionModel = require("../models/jsonVersions");
// const JsonDataModel = require("./../models/jsonDataSchema");

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

};