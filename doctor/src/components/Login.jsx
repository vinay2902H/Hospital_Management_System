import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../index";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password,  role: "Doctor" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Login successful!"); // Success message
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
   
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials"); // Error message
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (<>
    <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
    <section className="container form-component">
      <img src="/rguktlogo.png" alt="logo" className="logo" />
      <h1 className="form-title">WELCOME TO RGUKT HOSPITAL</h1>
      <p>Only Doctor Are Allowed To Access These Resources!</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Login</button></div>
      </form>
    </section>
    </>
  );
};

export default Login;
