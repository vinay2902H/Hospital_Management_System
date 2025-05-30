import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  nic: {
    type: String,
    required: [true, "ID Is Required!"],
    minLength: [7, "ID Must Contain 1 Char 6 Digits!"],
    maxLength: [7, "ID Must Contain 1 Char 6 Digits!"],
  },
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female"],
  },
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  faceDescriptors: {
    type: [Number], // Array of numbers to store face descriptors
    select: false, // Prevent sending sensitive data in API responses by default
  },
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a JWT
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 5000,
  });
};

export const User = mongoose.model("User", userSchema);
