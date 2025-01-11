import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chartData, setChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [doctorBarChartData, setDoctorBarChartData] = useState({});
  const [departmentLineChartData, setDepartmentLineChartData] = useState({});
  const [messagesLineChartData, setMessagesLineChartData] = useState({});
 
  const [appointmentsCount, setAppointmentsCount] = useState(0); // State to store appointments count
  const [doctorsCount, setDoctorsCount] = useState(0); // State to store doctors count

  const baseUrl = "http://localhost:4000/api";

  // Fetch appointments, doctors, and messages
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const appointmentsResponse = await axios.get(
          `${baseUrl}/v1/appointment/getall`,
          { withCredentials: true }
        );
        const doctorsResponse = await axios.get(
          `${baseUrl}/v1/user/doctors`,
          { withCredentials: true }
        );
        const messagesResponse = await axios.get(
          `${baseUrl}/v1/message/getall`,
          { withCredentials: true }
        );

        setAppointments(appointmentsResponse.data.appointments);
        setDoctors(doctorsResponse.data.doctors);
        setMessages(messagesResponse.data.messages);

        // Prepare all charts
        prepareChartData(appointmentsResponse.data.appointments);
        prepareDoctorPieChartData(appointmentsResponse.data.appointments); // Changed here to use appointments
        prepareDepartmentLineChartData(appointmentsResponse.data.appointments);
        prepareMessagesLineChartData(messagesResponse.data.messages);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    fetchAnalyticsData();
  }, []);

  // Prepare bar chart data for appointment statuses
  const prepareChartData = (appointments) => {
    const statusCounts = { Pending: 0, Accepted: 0, Rejected: 0 };

    appointments.forEach((appointment) => {
      statusCounts[appointment.status] =
        (statusCounts[appointment.status] || 0) + 1;
    });

    setChartData({
      labels: ["Pending", "Accepted", "Rejected"],
      datasets: [
        {
          label: "Number of Appointments",
          data: [
            statusCounts.Pending,
            statusCounts.Accepted,
            statusCounts.Rejected,
          ],
          backgroundColor: ["#FFC107", "#28A745", "#DC3545"],
        },
      ],
    });
  };

  // Prepare pie chart data for number of appointments per doctor
  const prepareDoctorPieChartData = (appointments) => {
    const doctorAppointmentCounts = {};

    appointments.forEach((appointment) => {
      const doctorName = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
      doctorAppointmentCounts[doctorName] =
        (doctorAppointmentCounts[doctorName] || 0) + 1;
    });

    setPieChartData({
      labels: Object.keys(doctorAppointmentCounts),
      datasets: [
        {
          label: "Number of Appointments per Doctor",
          data: Object.values(doctorAppointmentCounts),
          backgroundColor: [
            "#007bff",
            "#FFC107",
            "#28A745",
            "#DC3545",
            "#17A2B8",
            "#7F00FF",
            "#00FFFF",
            "#0C2340",
            "#000000",
          ],
        },
      ],
    });
  };

  // Prepare bar chart data for doctors by department
  const prepareDoctorBarChartData = (doctors) => {
    const departmentCounts = {};

    doctors.forEach((doctor) => {
      departmentCounts[doctor.department] =
        (departmentCounts[doctor.department] || 0) + 1;
    });

    setDoctorBarChartData({
      labels: Object.keys(departmentCounts),
      datasets: [
        {
          label: "Number of Doctors per Department",
          data: Object.values(departmentCounts),
          backgroundColor: ["#007bff", "#FFC107", "#28A745", "#DC3545"],
        },
      ],
    });
  };

  // Prepare line chart data for departments
  const prepareDepartmentLineChartData = (appointments) => {
    const departmentCounts = {};

    appointments.forEach((appointment) => {
      const department = appointment.department;
      departmentCounts[department] =
        (departmentCounts[department] || 0) + 1;
    });

    setDepartmentLineChartData({
      labels: Object.keys(departmentCounts),
      datasets: [
        {
          label: "Appointments per Department",
          data: Object.values(departmentCounts),
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  // Prepare line chart data for messages by date
  const prepareMessagesLineChartData = (messages) => {
    const messageCounts = {};

    messages.forEach((message) => {
      const date = new Date(message.date).toLocaleDateString();
      messageCounts[date] = (messageCounts[date] || 0) + 1;
    });

    setMessagesLineChartData({
      labels: Object.keys(messageCounts),
      datasets: [
        {
          label: "Messages by Date",
          data: Object.values(messageCounts),
          borderColor: "#17A2B8",
          backgroundColor: "rgba(23, 162, 184, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  const [patients, setPatients] = useState([]); // Store patient details
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
       
      }
    };
    fetchDoctors();
  }, []);

  const [messageCount, setMessageCount] = useState(0);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
        setMessageCount(data.messages.length); // Set message count in state
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
        setMessageCount(0); // Set to 0 if there's an error
      }
    };

    fetchMessages();
  }, []);






  const [uniquePatientCount, setUniquePatientCount] = useState(0); // Count of unique patients

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);

        // Count unique patients based on first and last name
        const uniquePatientsSet = new Set();
        data.appointments.forEach((appointment) => {
          const patientName = `${appointment.firstName} ${appointment.lastName}`;
          uniquePatientsSet.add(patientName); // Add to Set to keep unique names
        });
        
        setUniquePatientCount(uniquePatientsSet.size); // Set unique patient count

      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
        setUniquePatientCount(0); // Set to 0 if there's an error
      }
    };

    fetchAppointments();
  }, []);

  
  return (
    <div style={{ margin: "20px", marginLeft: "100px" }} >
    <h2 className="summary-heading">Statistics</h2>
  
    {/* Summary Container */}
    <div className="summary-container">
      {/* Total Appointments */}
      <div className="summary-card">
        <h5>Total Appointments</h5>
        <h3>{appointmentsCount}</h3>
      </div>
  
      {/* Total Patients */}
      <div className="summary-card">
        <h5>Total Patients</h5>
        <h3>{uniquePatientCount}</h3>
      </div>
  
      {/* Registered Doctors */}
      <div className="summary-card">
        <h5>Total Doctors</h5>
        <h3>{doctorsCount}</h3>
      </div>
  
      {/* Total Messages */}
      <div className="summary-card">
        <h5>Total Messages</h5>
        <h3>{messageCount}</h3>
      </div>
    </div>
  
    {/* Charts Section */}
    <div className="chart-section" style={{ marginRight: "20px" }}>
      <div className="chart-container">
        <h5>Appointments Overview </h5>
        {chartData && chartData.labels ? (
          <Bar data={chartData} options={{ responsive: true }} />
        ) : (
          "Loading chart..."
        )}
      </div>
  
      <div className="chart-container">
        <h5>Appointments per Doctor </h5>
        {pieChartData && pieChartData.labels ? (
          <Pie data={pieChartData} options={{ responsive: true }} />
        ) : (
          "Loading chart..."
        )}
      </div>
    </div>
  </div>
  
  );
};

export default AnalyticsPage;
