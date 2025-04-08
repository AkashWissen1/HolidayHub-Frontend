import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import "../../styles/EmployeeSearch.css";
import { FaSearch } from "react-icons/fa";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import logo from "../../assets/logo.svg";

const API_BASE_URL = "http://localhost:8084/hr/search/employee";

const EmployeeSearch = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tooltipData, setTooltipData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);

  const [employeeDetails, setEmployeeDetails] = useState({});
  const [clientDetails, setClientDetails] = useState({});
  
  const [username, setUsername] = useState("");
  const [empId, setEmpId] = useState("");
  const [emailId, setEmailId] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("employeeName");
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedEmailId = localStorage.getItem("email");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmployeeId) setEmpId(storedEmployeeId);
    if (storedEmailId) setEmailId(storedEmailId);
  }, []);

  const handleSearch = async () => {
    const trimmedId = employeeId.trim();
    if (!trimmedId) {
      setError("Please enter a valid Employee ID.");
      setHolidays([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/${trimmedId}`);
      if (!response.ok) throw new Error("Holidays not found.");
      const data = await response.json();

      const formattedHolidays = data.map((holiday) => ({
        title: holiday.holidayName,
        start: holiday.holidayDate,
        reason: holiday.holidayName,
      }));

      setHolidays(formattedHolidays);

      EmployeeDetails(trimmedId);
    } catch (err) {
      setHolidays([]);
      setError(err.message || "Something went wrong.");
    }
    setLoading(false);
  };

  const EmployeeDetails = async (employeeId) => {
    try { 
    
      const response = await fetch(`http://localhost:8085/employees/${employeeId}`);
      if (!response.ok) throw new Error("Employee details not found."); 

      const employeeData = await response.json();
      setEmployeeDetails(employeeData);

      console.log("Employee Details:", employeeData);

      const response2 = await fetch(`http://localhost:8081/clients/${employeeData.clientId}`);
      if (!response2.ok) throw new Error("Failed to fetch client details");
      const clientData = await response2.json();
      setClientDetails(clientData);

    }
    catch (err) {
      setError(err.message || "Something went wrong.");   
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const holidayDates = holidays.map((h) => h.start);

  return (
    <div className="employee-search-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src={logo} alt="Holiday Hub Logo" className="logo-image" />
        </div>
        <div className="user-options">
          <div className="profile-dropdown">
            <button className="profile-btn">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
                className="profile-icon"
              />
            </button>
            <div className="dropdown-content">
              <a onClick={() => setShowProfileOverlay(true)}>View Profile</a>
              <a href="/changepassword">Change Password</a>
              <a onClick={handleLogout}>Logout</a>

            </div>
          </div>
        </div>
      </header>

      {showProfileOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowProfileOverlay(false)}>X</button>
            <div className="overlay-title">Profile Details</div>
            <p><strong>Employee ID:</strong> {empId}</p>
            <p><strong>Name:</strong> {username}</p>
            <p><strong>Email ID:</strong> {emailId}</p>
            <p><strong>Designation:</strong> HR</p>
          </div>
        </div>
      )}

      <br /><br /><br />
      <div className="employee-search-body">
        <Sidebar className="sidebar" />
        <div className="employee-search-main">
        
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Enter Employee ID..."
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            
            <button className="search-button" onClick={handleSearch}>
              <FaSearch /> Search
            </button>
          </div>

          {loading ? (
            <p className="loading-text">Loading holidays...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : holidays.length > 0 ? (
            <div className="calendar-client-wrapper">
              <div className="calendar-box">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={holidays}
                  eventContent={() => null}
                  eventDidMount={(info) => {
                    info.el.style.cursor = "pointer";
                    info.el.addEventListener("mouseenter", () => {
                      const rect = info.el.getBoundingClientRect();
                      setPosition({ x: rect.left + 20, y: rect.top + 20 });
                      setTooltipData({
                        date: info.event.startStr,
                        reason: info.event.extendedProps.reason,
                      });
                    });
                    info.el.addEventListener("mouseleave", () => {
                      setTooltipData(null);
                    });
                  }}
                  height="auto"
                  dayCellDidMount={(info) => {
                    const date = new Date(info.date.getTime() - info.date.getTimezoneOffset() * 60000);
                    const dateStr = date.toISOString().split("T")[0];
                    if (holidayDates.includes(dateStr)) {
                      info.el.style.backgroundColor = "#F08080";
                      info.el.style.color = "#F08080";
                    }
                  }}
                />
                {tooltipData && (
                  <div className="tooltip" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
                    <div className="tooltip-header">
                      {new Date(tooltipData.date).toLocaleString("en-US", {
                        month: "long",
                      })}
                    </div>
                    <div className="tooltip-date">
                      {new Date(tooltipData.date).getDate()}
                    </div>
                    <div className="tooltip-reason">{tooltipData.reason}</div>
                  </div>
                )}
              </div>

              <div className="employee-info-box">
                <h3>Employee Details</h3>
                <p><strong>Employee ID:</strong> {employeeId}</p>
                <p><strong>Name:</strong> {employeeDetails.employeeName}</p>
                <p><strong>Email ID:</strong> {employeeDetails.email}</p>
                <p><strong>Client:</strong> {clientDetails.clientName}</p>
                <p><strong>Designation:</strong> Employee</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeSearch;
