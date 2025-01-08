// centraltruth.mjs
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri =  "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to insert data into MongoDB
export async function insertDataIntoMongoDB(data) {
  try {
    await client.connect();
    const database = client.db("CentralTruth");
    const collection = database.collection("CentralTruth-1");

    let result;
    if (Array.isArray(data)) {
      // If data is an array, use insertMany
      result = await collection.insertMany(data);
      console.log(`Inserted ${result.insertedCount} documents`);
    } else {
      // If data is a single object, use insertOne
      result = await collection.insertOne(data);
      console.log(`Data inserted with _id: ${result.insertedId}`);
    }

    return result;
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error.message);
    console.error('Error details:', error);
    throw error;
  } finally {
    await client.close();
  }
}