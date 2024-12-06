import mongoose from "mongoose";
import { Mongoose } from "mongoose";
import validator from "validator";

const prescriptionSchema = new mongoose.Schema({
  patient_fullName:{
    type: String,
    required: [true, "First Name Is Required!"],
  },
  doctor_fullName: {
    type: String,
    required: [true, "Doctor Name Is Required!"],
  },
  Medication_Name: {
    type: String,
    required: [true, "Doctor Name Is Required!"],
  },
  Dosage: {
    type: String,
    required: [true, "Doctor Name Is Required!"],
  },
  Frequency: {
    type: String,
    required: [true, "Doctor Name Is Required!"],
  },
  Duration_of_Treatment: {
    type: String,
    required: [true, "Doctor Name Is Required!"],
  },
  Special_Instructions: {
    type: String,
    required: [true, "Doctor Name Is Required!"],
  },
});

export const Prescription = mongoose.model("prescription", prescriptionSchema);
