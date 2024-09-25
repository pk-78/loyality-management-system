import express from 'express'
import { registerPatient } from '../controlller/patient.controller.js';


const patientRouter = express.Router()
patientRouter.post("/register", registerPatient);





export default patientRouter;