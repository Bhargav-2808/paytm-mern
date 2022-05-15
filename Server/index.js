import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import { router } from './Routes/route.js';



const app = express();
const PORT = 5555;
app.use(cors());
app.use(bodyParser.json());
app.use("/api",router);


app.listen(5555, ()=>{
    console.log("Express is  running");
})

