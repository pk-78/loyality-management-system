import express from 'express'
import { getAllPatients, registerPatient } from '../controlller/patient.controller.js';


const patientRouter = express.Router()
patientRouter.post("/register", registerPatient);
patientRouter.get('/getAllPatients', getAllPatients);         






export default patientRouter;