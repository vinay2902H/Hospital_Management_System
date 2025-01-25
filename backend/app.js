import express from "express";
import{dbConnection} from "./database/dbConnection.js"
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import prescriptionRouter from "./router/prescriptionRouter.js"

import emailRouter from "./router/emailRoutes.js"; // Add `.js` extension


const app = express();
config({ path: "./config.env" });

const allowedOrigins = ["https://rgukthospital-site.netlify.app", "https://rgukthospital-admin.netlify.app","https://rgukthospital-doctors.netlify.app"];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow credentials (cookies, etc.)
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api", emailRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/prescription", prescriptionRouter);

dbConnection();


app.use(errorMiddleware);
export default app;
