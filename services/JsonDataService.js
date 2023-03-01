const { MongoClient } = require('mongodb');
const URL = process.env.URL;
const client = new MongoClient(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // optional, timeout for selecting a server
    socketTimeoutMS: 60000 // 1 minute
  });
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