
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";
import patientRouter from "./routes/patient.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

// DB connection
connectDB();

app.use(express.json());

app.use(cors({
    origin: '*', // Or specify the allowed origins
}));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patient", patientRouter);



app.get("/",(req,res)=>{
    return res.send("hello")
})



app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
