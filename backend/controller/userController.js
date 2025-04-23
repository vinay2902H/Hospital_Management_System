import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// Patient Registration with Face Recognition
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    nic, 
    dob, 
    gender, 
    password,
  } = req.body;

  if (
    !firstName || !lastName || !email || !phone || 
    !nic || !dob || !gender || !password 
  ) {
    return next(new ErrorHandler("Please Fill Full Form !", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User Registered!", 200, res);
});

// Login with Password or Face Recognition
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Provide Email and Either Password !", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler("User Not Found With This Role!", 400));
  }

  if (password) {
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Email or Password!", 400));
    }
  } 
  generateToken(user, "Login Successfully!", 200, res);
});

// Helper Function to Match Face Descriptors

// Calculate Euclidean Distance Between Two Vectors
const calculateEuclideanDistance = (vector1, vector2) => {
  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += (vector1[i] - vector2[i]) ** 2;
  }
  return Math.sqrt(sum);
};



export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
    from,
    to,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar||
    !from||
    !to
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    from,
    to,
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});


export const getDoctorDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});


export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("doctorToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Doctor Logged Out Successfully.",
    });
});

// In appointmentController.js// userController.js

// Function to update doctor's availability
// Backend route for updating availability based on NIC
export const updateDoctorAvailability = async (req, res) => {
  try {
    const { doc } = req.params; // Get doctor's NIC from the route params
    const { availabilityFromDate, availabilityToDate } = req.body; // Get the dates from the request body
    console.log(doc);
    console.log(req.params);
    if (!availabilityFromDate || !availabilityToDate) {
      return res.status(400).json({ message: "Both dates must be provided." });
    }

    // Find the doctor by NIC and update the availability
    const doctor = await User.findOneAndUpdate(
      { nic: doc }, // Find doctor by NIC
      { $set: { from:availabilityFromDate, to:availabilityToDate } }, // Use $set to update specific fields
      { new: true } // Return the updated doctor document
    );
    

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    return res.status(200).json({
      message: 'Doctor availability updated successfully.',
      doctor, // Return the updated doctor document
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
