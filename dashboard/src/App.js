import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Messages from './components/Messages';
import AddNewDoctor from './components/AddNewDoctor';
import AddNewAdmin from './components/AnalyticsPage';
import Doctors from './components/Doctors';
import Login from './components/Login';
import "./App.css"
import  Sidebar from "./components/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from './index';
import axios from 'axios';
import AnalyticsPage from './components/AnalyticsPage';
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);  // Fix destructuring

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/admin/me", {
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
    <>
      <Router>
         <Sidebar/>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/doctor/addnew' element={<AddNewDoctor />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/doctors' element={<Doctors />} />
        </Routes>
        <ToastContainer position='top-center' />
      </Router>
    </>
  );
};

export default App;
