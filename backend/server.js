
import express from "express";
import connectDB from "./db/db.js";
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./routes/user.rouets.js";
import patientRouter from "./routes/patient.route.js";

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

// DB connection
connectDB();

app.use(express.json());

app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patient", patientRouter);



app.get("/",(req,res)=>{
    return res.send("hello")
})



app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
