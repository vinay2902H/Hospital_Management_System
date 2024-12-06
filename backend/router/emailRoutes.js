import express from "express";
import { sendEmail } from "../controller/emailControllers.js"; // Add `.js` extension

const router = express.Router();
console.log("hello");

router.post("/email/sendEmail", sendEmail);


export default router; // Use ES Module export
