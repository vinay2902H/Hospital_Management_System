import React, { useContext, useEffect } from 'react';
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import { Context } from './index';
import Login from './components/Login';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrescriptionForm from './components/PrescriptionForm';
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);  // Fix destructuring

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/doctor/me", {
          withCredentials: true
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [setIsAuthenticated]);  // Add missing dependencies

  return (
    <div className="App">
     
         <Router>  
       
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path="/prescription/:getappointmentid" element={<PrescriptionForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
