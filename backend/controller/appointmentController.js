import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

// Book an appointment
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    Medication_Name,
    Dosage,
    Frequency,
    Duration_of_Treatment,
    Special_Instructions,
    hasVisited,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  //const patientnic= req.user.nic;  

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    prescription:{
    Medication_Name,
    Dosage ,
    Frequency ,
    Duration_of_Treatment,
    Special_Instructions,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });

  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Sent!",
  });
});

// Get all appointments
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const getdocappointments = catchAsyncErrors( async (req, res) => {
  const { getappointmentid } = req.params;
  //console.log(req.params);
  
   //console.log(getappointmentid);
  try {    
    // Query for appointments with the specified doctornic and status "Accepted"
    const appointments = await Appointment.find({_id:getappointmentid});
   
    if (!appointments.length) {
      return res.status(404).json({ message: "No accepted appointments found for this doctor." });
    }

    res.json({ appointments });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments by patient's NIC
export const getAppointmentsByNIC = catchAsyncErrors(async (req, res, next) => {
  //console.log(req.params); // Log the entire params object

  // const {id}  = req.params; // Destructure nic from req.params
  // console.log('NIC:', nic); // Log the nic value

  // const ids= await Appointment.find(params.id)
  // console.log(ids.nic);


  const patientId = req.user._id;
  
  
  // Fetch patient details (optional, depending on your requirements)
  const patientDetails = await User.findById(patientId);
  // let appointmentpatient = await Appointment.find({nicval});
  
  if (!patientDetails) {
    return next(new ErrorHandler("Patient not found!", 404));
  }
  
  // Log the patient details if needed
  // console.log("Patient Details:", patientDetails);
  
  const nicval =patientDetails.nic;
  // console.log(nicval);
  // const url = `http://localhost:4000/getappointmentsbynic?nic=${nicval}`; // Construct the URL with query parameter

  const appointments = await Appointment.find({ nic: nicval });

  // console.log(appointments);
  if (!nicval) {
    return next(new ErrorHandler("NIC is not provided!", 400)); // Handle case where nic is undefined
  }

  

  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("No appointments found for this NIC!", 404));
  }

  res.status(200).json({
    success: true,
    appointments,
  });
});

export const getprescription = catchAsyncErrors(async (req, res, next) => {
  const { appointmentId } = req.params; // Get appointmentId from route params

  try {
    const appointment = await Appointment.findById(appointmentId); // Assuming you have an Appointment model

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ appointment }); // Send appointment data back to the client
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Update prescription details for a specific appointment

// Update Prescription endpoint
export const updateAppointmentprescription = catchAsyncErrors (async (req, res,next) => {
 // console.log("req.params:", req.params);

  const { appointmentId } = req.params;
 // const appointmentid=req.params; // Make sure this is correctly received
  //console.log("hhh",appointmentid);
  //console.log("");
  //console.log('Received Appointment ID:', appointmentId);
  const prescriptionData = req.body; // Get prescription data from the request body

  try {
      // Find the appointment by ID and update the prescription fields
       const updatedAppointment = await Appointment.findByIdAndUpdate(
         appointmentId,
           {
               $set: {   
                   'prescription.Medication_Name': prescriptionData.Medication_Name,
                   'prescription.Dosage': prescriptionData.Dosage,
                   'prescription.Frequency': prescriptionData.Frequency,
                   'prescription.Duration_of_Treatment': prescriptionData.Duration_of_Treatment,
                   'prescription.Special_Instructions': prescriptionData.Special_Instructions,
               }      
           },
           { new: true } // Return the updated document
      );
    

       if (!updatedAppointment) {
           return res.status(404).json({ message: "Appointment not found." });
       }

       res.status(200).json({ message: "Prescription updated successfully.", updatedAppointment });
  } catch (error) {
      console.error("Error updating prescription:", error);
      res.status(500).json({ message: "Server error" });
  }
});

  


export const getDoctorAppointments = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id;
  // console.log(doctorId)
  const doctorDetails = await User.findById(doctorId);
  // let appointmentpatient = await Appointment.find({nicval});
 // console.log(doctorDetails);
  if (!doctorDetails) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }
  
  // Log the patient details if needed
  // console.log("Patient Details:", patientDetails);
  const doctorval =doctorDetails.id;
  // console.log(doctorval);
  // const url = `http://localhost:4000/getappointmentsbynic?nic=${nicval}`; // Construct the URL with query parameter

  const appointments = await Appointment.find({ doctorId: doctorval });
  // console.log(appointments);
  if (!doctorval) {
    return next(new ErrorHandler("ID is not provided!", 400)); // Handle case where nic is undefined
  }
  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("No appointments found for this ID!", 404));
  }

  res.status(200).json({
    success: true,
    appointments,
  });
});




// Update appointment status
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    

    let appointment = await Appointment.findById(id);

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);


// Delete an appointment
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }

  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
