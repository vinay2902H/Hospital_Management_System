import express from "express";
import {
    isPatientAuthenticated,
    isDoctorAuthenticated,
  } from "../middlewares/auth.js";
import { postprescription,getprescription } from "../controller/prescription.js";
  
  const router = express.Router();

router.post("/post", isDoctorAuthenticated, postprescription);
router.get("/getprescription/:id", isPatientAuthenticated, getprescription);



  export default router;