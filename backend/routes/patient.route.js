import express from 'express'
import { getAllPatients, getPatientByUHID, handleTransaction, registerPatient } from '../controlller/patient.controller.js';


const patientRouter = express.Router()
patientRouter.post("/register", registerPatient);
patientRouter.get('/getAllPatients', getAllPatients);     
patientRouter.get('/patients/:UHID',getPatientByUHID);

patientRouter.post('/patients/:UHID/transaction', handleTransaction);    






export default patientRouter;