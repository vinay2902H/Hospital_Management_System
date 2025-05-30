import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  getDoctorDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
  logoutDoctor,
  updateDoctorAvailability,

} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/doctors", getAllDoctors);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/doctor/me", isDoctorAuthenticated, getDoctorDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/doctor/logout", isDoctorAuthenticated, logoutDoctor);
router.put("/doctor/availability/:doc", updateDoctorAvailability);
export default router;
