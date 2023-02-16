const { MongoClient } = require('mongodb');
const URL = process.env.URL;
const client = new MongoClient(URL);
const dbName = process.env.DATABASENAME;
module.exports = class JsonDataService {

    static db = async ()=>{
        await client.connect();
        return client.db(dbName);
    }
    
    static async getJsonData() {
        // Use connect method to connect to the server
        const db = await this.db()
        const collection = db.collection('Jsondata');
        const JsonData = collection.findOne();
        return JsonData
    }

    static async getCreditsJson() {
        const db = await this.db()
        const collection = db.collection('Jsoncredits');
        const JsonData = collection.findOne();
        return JsonData
    }

    static async getAppVersion(){
        const db = await this.db();
        const collection = db.collection("versions");
        const versions = collection.findOne();
        return versions
    }
};