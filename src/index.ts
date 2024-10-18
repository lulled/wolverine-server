import { Elysia } from "elysia";
import { justpull,grabT_shirts } from './fetch/fetch-sanity.mjs';
import { cors } from '@elysiajs/cors'


const app = new Elysia()
.use(cors({
  origin: ['http://localhost:3000', 'https://wolverine-server.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
  .get("/", () => "Hello Elysia")
  .get("/api/data", async () => {
    try {
      const data = await justpull();
      console.log('Data fetched from Sanity:', data);
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { success: false, error: error.message };
    }
  })
  .listen(3010);



//wat happens we i do this , define more add more  sever instances here with Different  names 
const menT_shirts = new Elysia()
.use(cors({
  origin: ['tauri://localhost', 'https://your-tauri-app-domain.com','http://localhost:1420'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
.get("/",()=>"hello from fashionate men-T-shirts")
.get("/api/t-shirtsStock", async ()=>{
  try{
    const data = await grabT_shirts();
    return {success:true,data};

  }catch(error){ 
    console.error("Error fetching t-shirts data");
    return {success:false,error: "Failed to fetch data"};
}
})
.listen(3011);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,`and at ${menT_shirts.server?.hostname}:${menT_shirts.server?.port} `
);
  
