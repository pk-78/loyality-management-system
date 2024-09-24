
import express from "express";
import connectDB from "./db/db.js";
import dotenv from "dotenv"

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

// DB connection
connectDB();

app.use(express.json());

app.use(cors());

app.get("/",(req,res)=>{
    console.log("hello")
})



app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
