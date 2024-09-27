import Patient from "../models/patient.model.js";

export const registerPatient = async (req, res) => {
  const { UHID, LoyalityCard, name, currentPoints } = req.body;

  try {
    // Check if UHID or Loyalty Card already exists
    const existingPatient = await Patient.findOne({ UHID });
    if (existingPatient) {
      return res.status(400).json({ message: "UHID already exists" });
    }

    const existingLoyaltyCard = await Patient.findOne({ LoyalityCard });
    if (existingLoyaltyCard) {
      return res.status(400).json({ message: "Loyalty Card already exists" });
    }

    // Create new patient
    const newPatient = new Patient({
      UHID,
      LoyalityCard,
      name,
      currentPoints,
      transaction: [],
    });

    await newPatient.save();
    res
      .status(201)
      .json({
        message: "Patient registered successfully",
        patient: newPatient,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatientByUHID = async (req, res) => {
  try {
    const { UHID } = req.params; // Get the dynamic UHID from the route
    const patient = await Patient.findOne({ UHID }); // Find patient by UHID

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ patient }); // Respond with patient data
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

///hancle tranction

export const handleTransaction = async (req, res) => {
  try {
    const { UHID } = req.params;
    const { points, transactionType, desk, remarks } = req.body;

    // Find the patient by UHID
    const patient = await Patient.findOne({ UHID });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update points based on transaction type
    if (transactionType === "Add") {
      patient.currentPoints += points; // Add points
    } else if (transactionType === "Deduct") {
      patient.currentPoints -= points; // Deduct points
      if (patient.currentPoints < 0) patient.currentPoints = 0; // Prevent negative points
    }

    // Add a new transaction entry to the patient's history
    patient.transaction.push({
      points,
      transactionType,
      desk,
      remarks,
      date: new Date(), // Store the date of the transaction
    });

    // Save the updated patient data
    await patient.save();

    res.json({ patient }); // Respond with updated patient data
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const  showTransaction = async(req,res)=>{
try {
  const {UHID} = req.params
  const patient = await Patient.findOne({ UHID });
    if (!patient) {
      return res.status(400).json({ message: 'Patient not found' });
    }
  const transactions = patient.transaction
  return res.status(200).json({message:"success",transactions})
} catch (error) {
  console.log(error.message);
    res.status(500).json("error in show transaction controller");
}
}
