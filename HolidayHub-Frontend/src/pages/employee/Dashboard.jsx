import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./HolidayCalender.css";
import "../../styles/Header.css";
import logo from "../../assets/logo.svg"; 
import Footer from "../../components/Footer";

const EmployeeDashboard = () => {
  const [username, setUsername] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [clientId, setClientId] = useState(null); 
  const [emailId, setEmailId] = useState("");
  const [clientDetails, setClientDetails] = useState(null);


  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [showProfileOverlay, setShowProfileOverlay] = useState(false);

 
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedClientId = localStorage.getItem("clientId");
    const storedemailId = localStorage.getItem("email");

    console.log("Stored Client ID:", storedClientId); 
    console.log("Stored Username:", storedUsername); 
    console.log("Stored Employee ID:", storedEmployeeId);
    console.log("Stored Email ID:", storedemailId);

    if (storedUsername) setUsername(storedUsername);
    if (storedEmployeeId) setEmployeeId(storedEmployeeId);
    if (storedClientId) setClientId(storedClientId);
    if (storedemailId) setEmailId(storedemailId); 
  }, []);


  useEffect(() => {
    if (clientId) {
      fetchHolidays(clientId);
      fetchClientDetails(clientId);
    }
  }, [clientId]); 

  const fetchClientDetails = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8081/clients/${clientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee details");
      }
      const data = await response.json();
      setClientDetails(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const fetchHolidays = async (clientId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8082/holidays/client/${clientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
      const data = await response.json();

      const formattedHolidays = data.map(holiday => ({
        title: holiday.holidayName,
        date: holiday.holidayDate,
        reason: holiday.holidayName, 
      }));

      setHolidays(formattedHolidays);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!event.target.closest(".fc-daygrid-day")) {
        setTooltipData(null);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMouseEnter = (info) => {
    const rect = info.el.getBoundingClientRect();
    setPosition({ x: rect.left + 20, y: rect.top + 20 });
    setTooltipData({
      date: info.event.startStr,
      reason: info.event.extendedProps.reason,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("clientId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    window.location.href = "/login"; 
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="logo-container">
          <img src={logo} alt="Holiday Hub Logo" className="logo-image" />
        </div>

        <div className="user-options">
          <span className="username">Hi, {username}</span>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button className="profile-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile" className="profile-icon" />
            </button>
            <div className="dropdown-content">
              <a onClick={() => setShowProfileOverlay(true)}>View Profile</a>
              <a onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      </header>


      {/* Profile Overlay */}
      {showProfileOverlay && (
        <div className="overlay">
          <div className="overlay-content">
          <button className="close-btn" onClick={() => setShowProfileOverlay(false)}>X</button>
            <div className="overlay-title">Profile Details</div>
            <p><strong>Employee ID:</strong> {employeeId}</p>
            <p><strong>Name:</strong> {username}</p>
            <p><strong>Email ID:</strong> {emailId}</p>
            <p><strong>Client:</strong> {clientDetails.clientName}</p>
            <p><strong>Designation:</strong> Employee</p>
          </div>
        </div>
      )}

      {/* Greeting and Calendar Section */}
      <div className="holiday-dashboard">
        <h1 className="greeting">Welcome, {username}</h1>

        {loading ? (
          <p>Loading holidays...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={holidays}
              eventMouseEnter={handleMouseEnter}
            />
            {tooltipData && (
              <div
                className="tooltip"
                style={{ top: `${position.y}px`, left: `${position.x}px` }}
              >
                <div className="tooltip-header">
                  {new Date(tooltipData.date).toLocaleString("en-US", { month: "long" })}
                </div>
                <div className="tooltip-date">{new Date(tooltipData.date).getDate()}</div>
                <div className="tooltip-reason">{tooltipData.reason}</div>
              </div>
            )}
          </div>
        )}
      </div>
      <br></br><br></br>
      <Footer />
    </div>
  );
};

export default EmployeeDashboard;
