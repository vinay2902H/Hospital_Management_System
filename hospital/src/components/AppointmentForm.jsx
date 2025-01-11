import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { Context } from "../index"; // Ensure Context is correctly imported

const AppointmentForm = () => {
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/patient/me", {
          withCredentials: true,
        });
        setNic(data.user.nic || "");
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");
        setDob(new Date(data.user.dob).toISOString().split("T")[0]);
        setGender(data.user.gender);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      }
    };

    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", {
          withCredentials: true,
        });
        setDoctors(data.doctors);
      } catch (error) {
        toast.error("Failed to fetch doctors.");
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
    fetchDoctors();
  }, [isAuthenticated]);

  const handleAppointment = async (e) => {
    e.preventDefault();
  
    if (!appointmentDate || !doctorFirstName || !doctorLastName) {
      toast.error("Please fill in all the required fields.");
      return;
    }
  
    // Check if the appointment date is in the past
    // if (new Date(appointmentDate) < new Date()) {
    //   toast.error("Appointment date cannot be in the past.");
    //   return;
    // }
  
    setIsLoading(true);
  
    try {
      // First, check the availability of the doctor by sending the appointment date
      const { data: appoint } = await axios.post(
        "http://localhost:4000/api/v1/appointment/check-availability",
        {
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          appointment_date: appointmentDate,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
  
      // Check if doctor availability data exists and handle doctor-to date comparison
      if (appoint.available) {
        const doctorAvailabilityFrom = new Date(appoint.fromDate); // Doctor's availability start date
        const doctorAvailabilityTo = new Date(appoint.toDate); // Doctor's availability end date
  
        // Compare appointment date with the doctor's availability range
        if (new Date(appointmentDate) < doctorAvailabilityFrom || new Date(appointmentDate) > doctorAvailabilityTo) {
          toast.error(`The selected doctor is not available on ${appointmentDate}. Available dates: ${doctorAvailabilityFrom.toLocaleDateString()} - ${doctorAvailabilityTo.toLocaleDateString()}.`);
          setIsLoading(false);
          return;
        }
  
        // Proceed with booking the appointment if date is valid
        const { data } = await axios.post(
          "http://localhost:4000/api/v1/appointment/post",
          {
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            appointment_date: appointmentDate,
            department,
            doctor_firstName: doctorFirstName,
            doctor_lastName: doctorLastName,
            address,
            hasVisited: Boolean(hasVisited),
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
  
        toast.success(data.message || "Appointment booked successfully!");
      
      } else {
        toast.error(appoint.message || "The selected doctor is not available on this date.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input type="text" placeholder="First Name" value={firstName} disabled />
          <input type="text" placeholder="Last Name" value={lastName} disabled />
        </div>
        <div>
          <input type="text" placeholder="Email" value={email} disabled />
          <input type="number" placeholder="Mobile Number" value={phone} disabled />
        </div>
        <div>
          <input type="text" placeholder="ID" value={nic} disabled />
          <input type="date" placeholder="Date of Birth" value={dob} disabled />
        </div>
        <div>
          <input type="text" value={gender} disabled />
          <input
            type="date"
            placeholder="Appointment Date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </div>
        <div>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setDoctorFirstName("");
              setDoctorLastName("");
            }}
          >
            {departmentsArray.map((dep, index) => (
              <option value={dep} key={index}>
                {dep}
              </option>
            ))}
          </select>
          <select
            value={`${doctorFirstName} ${doctorLastName}`}
            onChange={(e) => {
              const [firstName, lastName] = e.target.value.split(" ");
              setDoctorFirstName(firstName);
              setDoctorLastName(lastName);
            }}
            disabled={!department}
          >
            <option value="">Select Doctor</option>
            {doctors
              .filter((doc) => doc.doctorDepartment === department)
              .map((doc, index) => (
                <option value={`${doc.firstName} ${doc.lastName}`} key={index}>
                  {doc.firstName} {doc.lastName}
                </option>
              ))}
          </select>
        </div>
        <textarea
          rows="4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
            />
            Have you visited before?
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
