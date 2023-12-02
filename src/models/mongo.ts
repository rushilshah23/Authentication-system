import { ENV_VAR } from "@/configs/env.config";
import { MongoClient, Db } from "mongodb";




class MongoDBClient{
    private  uri!: string ;
    private dbName!:string;
    private client!:MongoClient;
    private  dbConnection!: Db;
    private  dbInitialized!:boolean;
    private static instance: MongoDBClient;

    public constructor(){
        this.uri =  ENV_VAR.MONGODB_URL;
        this.dbName = ENV_VAR.DB_NAME;
        this.client = new MongoClient(this.uri);
        this.dbInitialized=false;
        
    }

    public initMongoDB  = async() =>{
        if(this.dbInitialized){
            return;
        }
        try {
            await this.client.connect();
            console.log("MongoDB - Client connected");
            this.dbConnection =  this.client.db(this.dbName);
            console.log("MongoDB - DB Connection made")
            this.dbInitialized = true;

        } catch (error) {
            await this.client.close()
            console.log("Failed to init MongoDB ")
        }
    }

    public  getDB = async():Promise<Db> => {
        if(!this.dbInitialized){
            await this.initMongoDB()
        }
        return this.dbConnection
    }

    public static getInstance = ()=>{
        if(!this.instance){
            this.instance = new MongoDBClient();
        }
        return this.instance;
    }
    public  onlyGetDB = async():Promise<Db> => {
        if(!this.dbInitialized){
            throw Error("Cant connect to Database Try again later !")
        }else{

            return this.dbConnection
        }
    }

}

export default MongoDBClient.getInstance();







// // Create a new MongoClient
// const client = new MongoClient(uri, 
//     // { useNewUrlParser: true, useUnifiedTopology: true }
//     );

// export async function initializeMongoDB() {
//   try {
//     // Connect to the MongoDB server
//     await client.connect();

//     console.log('Connected to MongoDB');

//     // Access a specific database
//     const db = client.db(dbName);

//     // Access a specific collection
//     const collection = db.collection('myCollection');

//     // Insert a document
//     await collection.insertOne({ name: 'John', age: 30 });

//     // Find documents
//     const docs = await collection.find({ name: 'John' }).toArray();
//     console.log('Documents found:', docs);
//   } catch (error) {
//     console.error('Error occurred:', error);
//   } finally {
//     // Close the client
//     await client.close();
//   }
// }


