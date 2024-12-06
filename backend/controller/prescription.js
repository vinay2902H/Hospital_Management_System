import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import{ Prescription } from "../models/prescriptionSchema.js"

// Book an appointment
export const postprescription = catchAsyncErrors(async (req, res, next) => {
  const {
    patient_fullName,
    doctor_fullName,
    Medication_Name,
    Dosage,
    Frequency,
    Duration_of_Treatment,
    Special_Instructions,
  } = req.body;

  if (
    !patient_fullName || 
    !doctor_fullName ||
    !Medication_Name ||
    !Dosage ||
    !Frequency ||
    !Duration_of_Treatment ||
    !Special_Instructions 
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }


//  const doctorId = isConflict[0]._id;
  //const patientId = req.user._id;
  //const patientnic= req.user.nic;  

  const prescription = await Prescription.create({
    patient_fullName,
    doctor_fullName,
    Medication_Name,
    Dosage,
    Frequency,
    Duration_of_Treatment,
    Special_Instructions,
    
  });

  res.status(200).json({
    success: true,
    prescription,
    message: "prescription Sent!",
  });
});

export const getprescription = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const prescription = await Prescription.findById(id);
    console.log(prescription);
    if (!prescription) {
      return next(new ErrorHandler("Appointment Not Found!", 404));
    }
  
    const prescriptionid = await Prescription.find({ doctorId: doctorval });
    res.status(200).json({
      success: true,
      message: "Appointment Deleted!",
    });
  });