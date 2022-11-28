const Generic = require("../models/Ads/genericSchema")


module.exports = class Cat_SubCat_Search_service {
    /* 
    search on Category or subcategory
    */
    static async get_cat_subCat_ads(query) {
        const projection = {
            '_id': 1,
            'category': 1,
            'sub_category': 1,
            'title': 1,
            'price': 1,
            'image_url':  { $arrayElemAt: ["$image_url", 0] },
            'ad_type': 1,
            "created_at": 1,
            'isPrime': 1,
        }
        //$search inside $ text will search for text in generics collection similar to input given
        const { category, sub_category } = query;
        if (category && sub_category) {
            const cat_ads = await Generic.find({
                $and: [
                    { category: category },
                    { sub_category: sub_category }
                ]
            },
                projection
            ).sort({ created_at: -1 })
            return cat_ads
        }
        else if (category && !sub_category) {
            const cat_ads = await Generic.find({
                category: category
            },
                projection
            ).sort({ created_at: -1 })
            return cat_ads
        }
        else if (sub_category) {
            const cat_ads = await Generic.find({
                sub_category: sub_category
            },
                projection
            ).sort({ created_at: -1 })
            return cat_ads
        }
        else if(!category && ! sub_category){
            throw ({ status: 404, message: 'Select any category' });
        }
    }
}