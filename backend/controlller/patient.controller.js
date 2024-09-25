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
      res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  