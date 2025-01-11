import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { doctornic } = useParams();

  // For managing the doctor's availability
  const [availabilityFromDate, setAvailabilityFromDate] = useState("");
  const [availabilityToDate, setAvailabilityToDate] = useState("");

  // New state to store logged-in doctor's NIC
  const [doctorNic, setDoctorNic] = useState("");

  useEffect(() => {
    const fetchAppointmentsAndDoctor = async () => {
      try {
        // Fetching appointments for the doctor
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getdoctor/${doctornic}`,
          { withCredentials: true }
        );

        // Filter appointments with status "Accepted"
        const acceptedAppointments = data.appointments.filter(
          (appointment) => appointment.status === "Accepted"
        );
        setAppointments(acceptedAppointments);

        // Fetching doctor details
        const doctorData = await axios.get(
          "http://localhost:4000/api/v1/user/doctor/me",
          { withCredentials: true }
        );
        setDoctorDetails(doctorData.data.user); // Set doctor details
        setDoctorNic(doctorData.data.user.nic); // Save the logged-in doctor's NIC

        setError(null); // Clear any previous errors

        // Show notification if no accepted appointments
        if (acceptedAppointments.length === 0) {
          toast.info("No accepted appointments found.");
        }
      } catch (err) {
        setError("Failed to load data.");
        toast.error("Failed to load data. Please try again!");
        setAppointments([]);
        setDoctorDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointmentsAndDoctor();
  }, [doctornic]);

  const { isAuthenticated } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const handlePrescriptionUpdate = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, prescriptionUpdated: true }
          : appointment
      )
    );
  };

  const handleAvailabilityUpdate = async (e) => {
    e.preventDefault();

    if (!availabilityFromDate || !availabilityToDate) {
      setError("Please select both start and end dates.");
      toast.error("Please select both start and end dates.");
      return;
    }

    if (!doctorNic) {
      setError("Doctor's NIC is not available.");
      toast.error("Doctor's NIC is not available.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/v1/user/doctor/availability/${doctorNic}`, // Using NIC for the URL
        { availabilityFromDate, availabilityToDate },
        { withCredentials: true }
      );
      setError(null);
      setAvailabilityFromDate("");
      setAvailabilityToDate("");
      toast.success("Availability updated successfully!");
    } catch (err) {
      setError("Failed to update availability.");
      toast.error("Failed to update availability. Please try again.");
    }
  };

  const totalAppointments = appointments.length;

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <section className="dashboardpage">
        <div className="appointments-header">
          {/* Box for doctor's details */}
          {doctorDetails && (
            <div className="appointments-header-box1">
              <h3>
                Dr. {doctorDetails.firstName} {doctorDetails.lastName}
              </h3>
              <p>Email: {doctorDetails.email}</p>
              <p>Specialization: {doctorDetails.doctorDepartment}</p>
            </div>
          )}

          {/* Boxes for total appointments */}
          <div className="appointments-summary">
            <div className="appointments-header-box2">
              <h4>Total Accepted Appointments: {totalAppointments}</h4>
            </div>
          </div>
        </div>

        {/* Availability Update Form */}
        {doctorDetails && (
          <div className="availability-update-form">
            <h3>Update Availability</h3>
            <form onSubmit={handleAvailabilityUpdate}>
              <div>
                <label htmlFor="availabilityFromDate">From:</label>
                <input
                  type="date"
                  id="availabilityFromDate"
                  value={availabilityFromDate}
                  onChange={(e) => setAvailabilityFromDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="availabilityToDate">To:</label>
                <input
                  type="date"
                  id="availabilityToDate"
                  value={availabilityToDate}
                  onChange={(e) => setAvailabilityToDate(e.target.value)}
                />
              </div>
              <button type="submit">Update Availability</button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}

        <div className="appointments-section">
          {loading ? (
            <p>
              <img src="/Loading.gif" alt="Loading..." />
            </p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="banner">
              <h5>Appointments</h5>
              <table>
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.nic}</td>
                        <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                        <td>{appointment.appointment_date.substring(0, 10)}</td>
                        <td>{appointment.email}</td>
                        <td>
                          {appointment.hasVisited === false ? (
                            <span>Not Visited</span>
                          ) : (
                            <span>Visited</span>
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/prescription/${appointment._id}`}
                            onClick={() =>
                              handlePrescriptionUpdate(appointment._id)
                            }
                            className="button-link"
                          >
                            Update
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No Accepted Appointments Found!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
