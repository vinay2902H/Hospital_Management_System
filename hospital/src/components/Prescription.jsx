import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Prescription.css";

const Prescription = () => {
  const { getappointmentid } = useParams();
  const [appointmentData, setAppointmentData] = useState(null); // Initialize as null for a single appointment

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        console.log("Fetching data for appointment ID:", getappointmentid);
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getprescription/${getappointmentid}`,
          { withCredentials: true }
        );
        console.log("API response:", data); // Log the entire response

        // Check if data.appointment exists and is an object
        if (data.appointment && typeof data.appointment === 'object') {
          setAppointmentData(data.appointment); // Set the appointment data directly
          console.log("Fetched appointment data:", data.appointment); // Log the fetched data
        } else {
          console.log("No valid appointment data found.");
        }
      } catch (err) {
        console.log("Failed to fetch prescription data.");
        console.log(err);
      }
    };

    fetchPrescriptionData(); // Call the function to fetch data
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="table-container">
      <h2>Prescription Details</h2>
      {appointmentData ? ( // Check if appointmentData is not null
        <div className="prescription-details">
          <div className="detail-row">
            <span className="detail-label">Patient:</span>
            <span className="detail-value">{`${appointmentData.firstName} ${appointmentData.lastName}`}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Appointment Date:</span>
            <span className="detail-value">{appointmentData.appointment_date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{appointmentData.department}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Doctor:</span>
            <span className="detail-value">{`${appointmentData.doctor.firstName} ${appointmentData.doctor.lastName}`}</span>
          </div>
          {appointmentData.prescription ? (
            <>
              <div className="detail-row">
                <span className="detail-label">Medication Name:</span>
                <span className="detail-value">{appointmentData.prescription.Medication_Name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dosage:</span>
                <span className="detail-value">{appointmentData.prescription.Dosage}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Frequency:</span>
                <span className="detail-value">{appointmentData.prescription.Frequency}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration of Treatment:</span>
                <span className="detail-value">{appointmentData.prescription.Duration_of_Treatment}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Special Instructions:</span>
                <span className="detail-value">{appointmentData.prescription.Special_Instructions}</span>
              </div>
            </>
          ) : (
            <div className="detail-row">
              <span className="detail-label">Prescription:</span>
              <span className="detail-value">No prescription details available</span>
            </div>
          )}
        </div>
      ) : (
        <p>No prescriptions found for this appointment.</p>
      )}
    </div>
  );
};

export default Prescription;
