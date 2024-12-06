import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // State to store doctors
  const [appointmentsCount, setAppointmentsCount] = useState(0); // State to store appointments count
  const [doctorsCount, setDoctorsCount] = useState(0); // State to store doctors count

  const baseUrl = "http://localhost:4000/api"; // Backend base URL

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
        setAppointmentsCount(data.appointments.length); // Set the count of appointments
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
        setAppointmentsCount(0); // Set to 0 if there's an error
      }
    };
    fetchAppointments();
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
        setDoctorsCount(data.doctors.length); // Set the count of doctors
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.response?.data?.message || "Failed to fetch doctors.");
      }
    };
    fetchDoctors();
  }, []);

  // Handle status update for appointments and send emailconst handleUpdateStatus = async (appointmentId, status) => {
    const handleUpdateStatus = async (appointmentId, status) => {
  try {
    const { data } = await axios.put(
      `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
      { status },
      { withCredentials: true }
    );
  
    // Update the local state
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, status }
          : appointment
      )
    );
  
    toast.success(data.message); // Show success message for status update
  
    // Find the appointment details to send an email
    const updatedAppointment = appointments.find(
      (appointment) => appointment._id === appointmentId
    );
  
    if (updatedAppointment) {
      const { email, firstName, lastName, appointment_date, department, doctor } = updatedAppointment;
  
      // Get doctor's full name
      const doctorName = `${doctor.firstName} ${doctor.lastName}`;
  
      let emailData = {
        email,
        subject: "",
        message: "",
      };
  
      if (status === "Accepted") {
        emailData.subject = "Appointment Confirmation - Accepted";
        emailData.message = `Dear ${firstName} ${lastName},\n\nWe are pleased to inform you that your appointment request with Dr. ${doctorName}, ${department}, has been successfully accepted. Below are the details of your upcoming appointment:\n\n` +
          `Appointment Details:\n\n` +
          `Patient Name: ${firstName} ${lastName}\n` +
          `Doctor's Name: Dr. ${doctorName}\n` +
          `Specialization: ${department}\n` +
          `Date & Time: ${appointment_date}\n` +
          `Department: ${department}\n` +
          `Location: Rgukt Hospital,Basar\n\n` +
          `Important Notes:\n\n` +
          `• Please arrive 15 minutes before your scheduled appointment.\n` +
          `• Bring along any medical records or reports that may assist Dr. ${doctorName}.\n` +
          `• If you are unable to attend, please inform us at least 24 hours in advance.\n\n` +
          `If you have any questions or need further assistance, feel free to contact us at 123-456-7890 or email support@rgukthospital.com.\n\n` +
          `We look forward to seeing you on the scheduled date and wish you a healthy visit.\n\n` +
          `Best regards,\n\n` +
          `RGUKT Hospital\n` +
          `Basar,\n` +
          `123-456-7890\n` +
          `support@rgukthospital.com\n` +
          `www.rgukthospital.com`;
      } else if (status === "Rejected") {
        emailData.subject = "Appointment Request - Rejected";
        emailData.message = `Dear ${firstName} ${lastName},\n\nWe regret to inform you that your appointment request with Dr. ${doctorName}, ${department}, has been rejected. Unfortunately, we are unable to accommodate your request at this time.\n\n` +
          `We apologize for any inconvenience this may cause and encourage you to reach out to our support team for any further assistance.\n\n` +
          `If you have any questions or would like to reschedule your appointment, please feel free to contact us at 123-456-7890 or email support@rgukthospital.com.\n\n` +
          `We appreciate your understanding and hope to assist you soon.\n\n` +
          `Best regards,\n\n` +
          `RGUKT Hospital\n` +
          `Basar,\n` +
          `123-456-7890\n` +
          `support@rgukthospital.com\n` +
          `www.rgukthospital.com`;
      }
  
      // Send email
      const response = await fetch(`http://localhost:4000/api/email/sendEmail`, {
        method: "POST",
        body: JSON.stringify(emailData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      toast.success("Email sent successfully!"); // Success message for email sent
    }
  } catch (error) {
    console.error("Error updating status or sending email:", error);
    toast.error(
      error.response?.data?.message || "Failed to update status or send email."
    ); // Error message for status or email failure
  }
};

  
  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc2.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>
                  {admin && `${admin.firstName} ${admin.lastName}`}
                </h5>
              </div>
              <p>
              Manage appointments, doctors, and messages. View key metrics, charts, and insights to streamline hospital operations and decision-making.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointmentsCount}</h3> {/* Display the count of appointments */}
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{doctorsCount}</h3> {/* Display the count of doctors */}
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td>
                        {appointment.hasVisited === true ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
