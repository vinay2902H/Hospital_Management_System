import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose.connect("mongodb+srv://vinay:vinay123@cluster0.fqol9.mongodb.net/?retryWrites=true", {
      dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database:,${err}`);
    });
};
