import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PrescriptionForm.css";

const PrescriptionForm = () => {
  const { getappointmentid } = useParams();
  const [appointmentData, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState({});
  const [updatedPrescriptions, setUpdatedPrescriptions] = useState([]); // Track updated prescriptions
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getappointment/${getappointmentid}`,
          { withCredentials: true }
        );
        setAppointmentData(data.appointments);
        const initialPrescriptions = {};
        data.appointments.forEach((appointment) => {
          initialPrescriptions[appointment._id] = {
            Medication_Name: "",
            Dosage: "",
            Frequency: "",
            Duration_of_Treatment: "",
            Special_Instructions: ""
          };
        });
        setPrescriptions(initialPrescriptions);
      } catch (err) {
        setError("No appointments found.");
        toast.error("No appointments found.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [getappointmentid]);

  const handleInputChange = (appointmentId, e) => {
    const { name, value } = e.target;
    setPrescriptions((prevPrescriptions) => ({
      ...prevPrescriptions,
      [appointmentId]: {
        ...prevPrescriptions[appointmentId],
        [name]: value
      }
    }));
  };

  const handleUpdatePrescription = async (appointmentId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/updateprescription/${appointmentId}`,
        prescriptions[appointmentId]
      );
      toast.success(data.message || `Prescription updated for ID: ${appointmentId}`);

      // Mark as updated
      setUpdatedPrescriptions((prevUpdated) => [...prevUpdated, appointmentId]);

      // Navigate after a delay
      setTimeout(() => {
        navigate(`/`);
      }, 3500);
    } catch (error) {
      console.error(`Error updating prescription for ID ${appointmentId}:`, error);
      toast.error(`Failed to update prescription for ID: ${appointmentId}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
      />
      <h2>Update Prescriptions for Appointments</h2>
      {appointmentData.map((appointment) => (
        <div key={appointment._id} className="appointment-card">
          <h3>
            Update Prescription for {appointment.firstName} {appointment.lastName}
          </h3>
          <form>
            <label>
              Medication Name:
              <input
                type="text"
                name="Medication_Name"
                value={prescriptions[appointment._id]?.Medication_Name || ""}
                onChange={(e) => handleInputChange(appointment._id, e)}
              />
            </label>
            <label>
              Dosage:
              <input
                type="text"
                name="Dosage"
                value={prescriptions[appointment._id]?.Dosage || ""}
                onChange={(e) => handleInputChange(appointment._id, e)}
              />
            </label>
            <label>
              Frequency:
              <input
                type="text"
                name="Frequency"
                value={prescriptions[appointment._id]?.Frequency || ""}
                onChange={(e) => handleInputChange(appointment._id, e)}
              />
            </label>
            <label>
              Duration of Treatment:
              <input
                type="text"
                name="Duration_of_Treatment"
                value={prescriptions[appointment._id]?.Duration_of_Treatment || ""}
                onChange={(e) => handleInputChange(appointment._id, e)}
              />
            </label>
            <label>
              Special Instructions:
              <input
                type="text"
                name="Special_Instructions"
                value={prescriptions[appointment._id]?.Special_Instructions || ""}
                onChange={(e) => handleInputChange(appointment._id, e)}
              />
            </label>
            <button
              type="button"
              onClick={() => handleUpdatePrescription(appointment._id)}
              disabled={updatedPrescriptions.includes(appointment._id)} // Disable after update
            >
              {updatedPrescriptions.includes(appointment._id) ? "Updated" : "Update Prescription"}
            </button>
          </form>
        </div>
      ))}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PrescriptionForm;
