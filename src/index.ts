// Import necessary modules
import { Elysia } from "elysia";
import { justpull, grabT_shirts, bulkproductuploads } from './fetch/fetch-sanity.mjs';
import { cors } from '@elysiajs/cors';
import { insertDataIntoMongoDB } from './fetch/centraltruth.mjs'; // Import the MongoDB function

//const DATA_FILE_PATH = './store_data.json';

// // Function to write data to file (optional, if you still want to keep this)
// async function writeDataToFile(data) {
//   try {
//     await Bun.write(DATA_FILE_PATH, JSON.stringify(data, null, 2));
//     console.log('Data written to file successfully');
//   } catch (error) {
//     console.error('Error writing to file:', error);
//     throw error;
//   }
// // }

// // Function to read data from file (optional, if you still want to keep this)
// async function readDataFromFile() {
//   try {
//     const file = Bun.file(DATA_FILE_PATH);
//     if (await file.exists()) {
//       const text = await file.text();
//       return JSON.parse(text);
//     }
//     return null;
//   } catch (error) {
//     console.error('Error reading from file:', error);
//     return null;
//   }
// }

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000', 'https://wolverine-server.onrender.com', 'http://localhost','http://localhost:3040','http://localhost:3002','http://localhost:8081/','http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
  .get("/", () => "Hello Elysia")
  .get("/api/data", async () => {
    try {
      const data = await bulkproductuploads();
      console.log('Data fetched from Sanity:', data);
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { success: false, error: error.message };
    }
  })
  // Modify this to use MongoDB for storage
  .post("/api/receive-data", async ({ body, request }) => {
    console.log('Received request with method:', request.method);
    console.log('Headers:', JSON.stringify(request.headers, null, 2));
    console.log('Body type:', typeof body);
    console.log('Is body an array?', Array.isArray(body));
    //console.log('Body:', JSON.stringify(body, null, 2));
    
    let itemCount = 0;
    if (Array.isArray(body)) {
      itemCount = body.length;
    } else if (typeof body === 'object' && body !== null) {
      itemCount = Object.keys(body).length;
    }

    console.log('Processed item count:', itemCount);

    // Save data to MongoDB
    try {
      await insertDataIntoMongoDB(body); // Insert the received data into MongoDB
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      return { success: false, error: error.message };
    }

    return {
      message: 'Data received, logged, and saved to MongoDB',
      itemCount: itemCount,
      bodyType: typeof body,
      isArray: Array.isArray(body),
      sampleData: Array.isArray(body) ? body.slice(0, 2) : body
    };
  })
  .get("/api/stored-data", async () => {
    try {
      const storedData = await readDataFromFile();
      return { success: true, storedData };
    } catch (error) {
      console.error("Error reading stored data:", error);
      return { success: false, error: error.message };
    }
  })
  .listen(3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);