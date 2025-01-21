import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Singleton MongoDB client
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("CentralTruth");
  }
  return db;
}

// Function to validate UUID
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Function to insert data into MongoDB
export async function insertDataIntoMongoDB(data) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection("CentralTruth-1");

    let result;
    if (Array.isArray(data)) {
      result = await collection.insertMany(data);
      console.log(`Inserted ${result.insertedCount} documents`);
    } else {
      result = await collection.insertOne(data);
      console.log(`Data inserted with _id: ${result.insertedId}`);
    }

    return result;
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error.message);
    console.error('Error details:', error);
    throw error;
  }
}

// Function to read all data from CentralTruth-1
export async function readAllDataFromCentraltruth() {
  try {
    const database = await connectToDatabase();
    const collection = database.collection("CentralTruth-1");

    // Fetch all documents
    const cursor = collection.find({});
    const documents = await cursor.toArray();
    console.log('Pulled all data from "CentralTruth-1"');

    // Return the fetched documents
    return documents;
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    return null;
  }
}

// Function to delete a document by ID
export async function deleteDocumentById_One(id) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection("CentralTruth-1");

    console.log('Attempting to delete document with ID:', id);

    // Validate UUID format
    if (!id || !isValidUUID(id)) {
      console.log('Invalid UUID format:', id);
      return { success: false, error: 'Invalid UUID format' };
    }

    // Create the query using the exact field structure from your data
    const query = { "_id": id };
    console.log('Delete query:', query);

    // First, verify the document exists
    const documentExists = await collection.findOne(query);
    if (!documentExists) {
      console.log('Document not found:', id);
      return { success: false, message: 'Document not found' };
    }

    // Perform the delete operation
    const result = await collection.deleteOne(query);
    console.log('Delete operation result:', result);

    if (result.deletedCount === 1) {
      console.log('Document deleted successfully:', id);
      return { 
        success: true, 
        message: 'Document deleted successfully',
        productID: documentExists.productID
      };
    } else {
      console.log('Delete operation failed for ID:', id);
      return { success: false, message: 'Delete operation failed' };
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: `Database error: ${error.message}` };
  }
}

// Function to update a single item by ID
export async function updateItemById(id, updateData) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection("CentralTruth-1");

    // Validate UUID
    if (!id || !isValidUUID(id)) {
      console.log('Invalid UUID:', id);
      return { success: false, error: 'Invalid UUID format' };
    }

    // Create the query
    const query = { "_id": id };

    // Update the document
    const result = await collection.updateOne(query, { $set: updateData });

    if (result.modifiedCount === 1) {
      console.log('Document updated successfully:', id);
      return { success: true, message: 'Document updated successfully' };
    } else {
      console.log('No document found with the given ID:', id);
      return { success: false, message: 'No document found with the given ID' };
    }
  } catch (error) {
    console.error('Error updating document:', error);
    return { success: false, error: error.message };
  }
}

// API endpoint handler for delete operation
export const deleteOneHandler = async ({ body }) => {
  try {
    const { id } = body;
    
    console.log('Received delete request for ID:', id);

    if (!id) {
      return { success: false, error: 'ID is required' };
    }

    if (!isValidUUID(id)) {
      return { success: false, error: 'Invalid ID format' };
    }

    const result = await deleteDocumentById_One(id);
    console.log('Delete operation result:', result);

    if (result.success) {
      return { 
        success: true, 
        message: result.message,
        deletedProductID: result.productID
      };
    } else {
      return { 
        success: false, 
        error: result.error || result.message 
      };
    }
  } catch (error) {
    console.error('Error in DELETE /api/deleteone:', error);
    return { success: false, error: 'Internal server error' };
  }
}