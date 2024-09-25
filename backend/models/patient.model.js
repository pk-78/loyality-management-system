import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    points: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["Add", "Deduct"],
    },
    desk: {
      type: String,
      required: true,
      enum: ["Front Desk", "Billing Desk", "Pharmacy Desk"],
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const patientSchema = mongoose.Schema(
  {
    UHID: {
      type: String,
      required: true,
      unique: true,
    },
    LoyalityCard:{
        type:String,
        required:true,
        unique:true
    },
    name: {
      type: String,
      required: true,
    },
    currentPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    transaction: {
      type: [transactionSchema],
    },
  },
  {
    timeStamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
