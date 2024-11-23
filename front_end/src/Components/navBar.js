import React, { useState, useEffect, useRef } from "react";
import "../styles/navbar.css";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { fetchData } from "./form";
import RotatingIcon from "./loadingIcon";
import { Dropdown } from "../pages/home";

const DisplayUserInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { checkTokenAndRefresh } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      let [data, error] = await fetchData(
        "GET",
        "api/user/get-user-info/",
        checkTokenAndRefresh
      );
      setIsLoading(false);
      if (data) {
        setData(data);
      } else {
        setError(error);
      }
    };
    fetchUserInfo();
  }, []);

  if (isLoading) {
    return <RotatingIcon />;
  }

  if (error) return <p>{error}</p>;

  if (!data) return <p>No user info available</p>;

  return (
    <div className="navbar-user-info">
      <span className="user-name">{data.first_name || data.email}</span>
      <span className="school-name">{data.role}</span>
      <span className="school-name">{data.school_name}</span>
    </div>
  );
};

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [register, setRegister] = useState(false);
  const navigate = useNavigate();
  const user = useAuth();
  const dropdownRef = useRef(null); // Ref for user info dropdown
  const registerRef = useRef(null); // Ref for register dropdown

  // Check localStorage when the component mounts
  useEffect(() => {
    if (user.token) {
      setIsLoggedIn(true);
    }
  }, [user]);

  // Handle click outside to close user info dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setRegister(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, registerRef]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    user.logOut();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const seeRegister = () => {
    setRegister(!register);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          sHule
        </Link>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="dropdown-nav" ref={dropdownRef}>
            <button onClick={seeRegister} className="seeRegister">
              Register ...
            </button>
            {register && (
              <div className="dropdown-menu" ref={registerRef}>
                <Dropdown />
              </div>
            )}
            <button className="user-icon" onClick={toggleDropdown}>
              <FaUser />
            </button>
            {showDropdown && (
              <div className="dropdown-menu-nav">
                <DisplayUserInfo />
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleLogin} className="user-icon">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
