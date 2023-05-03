const moment = require('moment')
const BusinessInfoModel = require("../models/Profile/BusinessDetailSchema");

module.exports = class BusinessAdService {
    static async createBusinessProfileService(userID, body) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const {
            name,
            address,
            phoneNumber,
            description,
            businessUrl,
            certificateUrl,
       } = body;

       const BusinessPofileDoc = await BusinessInfoModel.create({
            name,
            userID:userID,
            address,
            phoneNumber,
            description,
            businessUrl,
            certificateUrl,
            createdAt:currentDate,
            updatedAt:currentDate

       })
       return BusinessPofileDoc
    }
}