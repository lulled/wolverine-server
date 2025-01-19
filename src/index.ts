// Import necessary modules
import { Elysia } from "elysia";
import { justpull, grabT_shirts, bulkproductuploads } from './fetch/fetch-sanity.mjs';
import { cors } from '@elysiajs/cors';
import { insertDataIntoMongoDB,readAllDataFromCentraltruth } from './fetch/centraltruth.mjs'; // Import the MongoDB function


const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000', 'https://wolverine-server.onrender.com', 'http://localhost','http://localhost:3040','http://localhost:3002','http://localhost:8081/','http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
  .get("/", () => "hello from Fashionate UG")
  .get("/api/deployed", async () => {
    try {
      const data = await bulkproductuploads();
     // console.log('Data fetched from Sanity:', data);
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { success: false, error: error.message };
    }
  })
  // storing data thas coming from local "hit-server" to mongo DB instance, self managed
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
  // build Api routes that read, write ,update and delete from Central-truth

  // fetch all data from CentralTruth-1 and make it Available  to wolverine Client 
  .get("/api/centraltruth",async()=>{
    try {
      const data = await readAllDataFromCentraltruth();
      console.log('Data pulled from CentralTruth-1');
      return { success: true, data };
    } catch (error) {
      console.error("Error pulling data from  CentralTruth-1 :", error);
      return { success: false, error: error.message };

  }
 }
 )
 // post method for updating a single product json object 
 .put("/api/updateitem",({body,request})=>{

 })
 //


  .listen(3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);