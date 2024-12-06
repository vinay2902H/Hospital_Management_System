import api from '.api'; // Import the axios instance

// Example function to fetch patient data by NIC
async function getPatientDataByNIC(nic) {
  try {
    const response = await api.get(`/appointment/getpatientbynic/${nic}`);

    if (response.data.success) {
      console.log('Patient Data:', response.data.appointments);
      // Display the appointment data to the user, or handle it in your UI
    } else {
      alert('No appointments found!');
    }
  } catch (error) {
    console.error('Error fetching patient data:', error);
    alert('An error occurred while fetching patient data');
  }
}

// Call this function to fetch data, e.g., when a button is clicked
const handleFetchData = () => {
  const nic = document.getElementById('nic').value;

  if (nic) {
    getPatientDataByNIC(nic);
  } else {
    alert('Please enter a valid NIC');
  }
};
