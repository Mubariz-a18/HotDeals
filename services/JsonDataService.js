const { MongoClient } = require('mongodb');
const URL = process.env.URL;
const client = new MongoClient(URL);
const dbName = process.env.DATABASENAME;
module.exports = class JsonDataService {
    static async getJsonData() {
        // Use connect method to connect to the server
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('Jsondata');
        const JsonData = collection.findOne();
        return JsonData
    }
};