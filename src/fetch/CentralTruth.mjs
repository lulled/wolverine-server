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
export async function readAllDataFromCentraltruth() {
  

  try {
    
    await client.connect();

    // Specify the database and collection
    const database = client.db("CentralTruth");
    const collection = database.collection("CentralTruth-1");

    // Fetch all documents
    const bolb = collection.find({}); // Empty query to match all documents
    const documents = await bolb.toArray(); // Convert bolb to an array of documents
    console.log('pulled all data from "CentralTruth-1"');

    // Return the fetched documents
    return documents;
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    // Return null or an error message to indicate failure
    return null;
  } finally {
    // Close the connection only if it was successfully opened
    if (client) {
      await client.close();
    }
  }
}