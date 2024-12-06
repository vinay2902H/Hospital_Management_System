import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import './Dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null); // To store doctor details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { doctornic } = useParams();

  useEffect(() => {
    const fetchAppointmentsAndDoctor = async () => {
      try {
        // Fetching appointments for the doctor
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getdoctor/${doctornic}`,
          { withCredentials: true }
        );
        setAppointments(data.appointments);

        // Fetching doctor details
        const doctorData = await axios.get(
          "http://localhost:4000/api/v1/user/doctor/me",
          { withCredentials: true }
        );
        setDoctorDetails(doctorData.data.user); // Set doctor details
        
      } catch (err) {
        setError("Failed to load data.");
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

  // Calculate appointment count
  const totalAppointments = appointments.length;
  const acceptedAppointments = appointments.filter(
    (appointment) => appointment.status === "Accepted"
  ).length;

  return (
    <>
      <Navbar />
      <section className="dashboardpage">
        <div className="appointments-header">
          {/* Box for doctor's details */}
          {doctorDetails && (
            <div className="appointments-header-box1">
              <h3>Dr. {doctorDetails.firstName} {doctorDetails.lastName}</h3>
              <p>Email: {doctorDetails.email}</p>  {/* Display doctor's email */}
              <p>Specialization: {appointments[0]?.department}</p> {/* Using department from the first appointment */}
            </div>
          )}

          {/* Boxes for total appointments and accepted appointments */}
          <div className="appointments-summary">
            <div className="appointments-header-box2">
              <h4>Total Appointments: {totalAppointments}</h4>
            </div>
            <div className="appointments-header-box2">
              <h4>Accepted Appointments: {acceptedAppointments}</h4>
            </div>
          </div>
        </div>

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
                  {appointments && appointments.length > 0 ? (
                    appointments
                      .filter((appointment) => appointment.status === "Accepted")
                      .map((appointment) => (
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
                      <td colSpan="6">No Appointments Found!</td>
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
