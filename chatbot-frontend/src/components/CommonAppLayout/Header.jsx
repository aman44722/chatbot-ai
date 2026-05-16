import React from "react";
import logo from "../../assets/images/bot-logo-blue.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="before-header">
        <p>
          Introducing AI Agents to Streamline Your Team’s Work - Book a Demo
          Now!
        </p>
      </div>
      <header className="header">
        <div className="logo">
          <img style={{ width: "80px" }} src={logo} alt="Smart Bot Logo" />
        </div>
        <nav className="nav">
          <a href="#">Product</a>
          <a href="#">AI Services</a>
          <a href="#">Partnerships</a>
          <a href="#">Resources</a>
        </nav>
        <div className="logins">
          {/* Login Button */}
          <button className="primaryBtn" onClick={() => navigate("/login")}>
            Login
          </button>

          {/* Signup Button (abhi aap chahe to /signup ya /register pe bhej sakte ho) */}
          <button className="secondaryBtn" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
