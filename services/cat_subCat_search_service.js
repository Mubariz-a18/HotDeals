const Generic = require("../models/Ads/genericSchema")


module.exports = class Cat_SubCat_Search_service {

    static async get_cat_subCat_ads(query) {
        const {category , sub_category} = query; 
        const cat_ads = await Generic.find( {$text: { $search: `${category},${sub_category}` }})
        return cat_ads
    }
}