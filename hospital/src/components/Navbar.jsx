import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../index";
//import Call from "../videocall/Call";
const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    localStorage.removeItem("isAuthenticated"); // Clear from storage on logout
    localStorage.removeItem("user"); // Clear use
    await axios
      .get("http://localhost:4000/api/v1/user/Patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
  
      navigateTo("/login");
   
  };

  return (
    <>
      <nav className={"container"}>
        <div className="logo">
          <img src="/rguktlogo.png" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
           
<button className="but">
  Home
</button>
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
             <button className="but"> Appointment</button>
            </Link>
            <Link to={"/status"} onClick={() => setShow(!show)}>
            <button className="but">Appointment Status </button>
            </Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>
            <button className="but"> About Us</button>
            </Link>
           
          </div>
          {isAuthenticated ? (
            <button class="button type1" onClick={handleLogout}>
              
              
            </button>
          ) : (
            <button className="button type2" onClick={goToLogin}>
              
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
           
        </div>
      </nav>
    </>
  );
};

export default Navbar;