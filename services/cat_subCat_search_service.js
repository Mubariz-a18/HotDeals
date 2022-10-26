const Generic = require("../models/Ads/genericSchema")


module.exports = class Cat_SubCat_Search_service {
    /* 
    search on Category or subcategory
    */
    static async get_cat_subCat_ads(query) {
        //$search inside $ text will search for text in generics collection similar to input given
        const {category , sub_category} = query; 
        const cat_ads = await Generic.find( {$text: { $search: `${category},${sub_category}` }})
        return cat_ads
    }
}