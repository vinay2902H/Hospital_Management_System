import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { Navigate, useParams ,Link} from "react-router-dom";
import axios from "axios";
import "./Status.css";

 // Import the refresh icon from react-icons

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error
  const { nicval } = useParams(); // Retrieve 'nicval' from the URL

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getpatientbynic/${nicval}`,
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (err) {
        setError("NO Appointments Found .");//Failed to fetch appointments
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [nicval]);

  // const { isAuthenticated, patient } = useContext(Context);
  // if (!isAuthenticated) {
  //   return <Navigate to={"/login"} />;
  // }

  const handleRefresh = () => {
    window.location.reload();  // Refresh the page when the icon is clicked
  };
  const handleUpdateClick = (appointmentId) => {
    window.open();
  };
  

  return (
    <section className="dashboard">
      
      <div className="appointments-section">
      <h5>Appointments</h5>
      &nbsp;
        {loading ? (
          <p><img src="/Loading.gif" alt="vector" /></p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="banner">
          
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Prescription</th>
                </tr>
              </thead>
              <tbody>
                {appointments && appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 10)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <span
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td><Link to={`/Prescription/${appointment._id}`} className="button-link">VIEW</Link></td>
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
  );
};

export default Dashboard;
