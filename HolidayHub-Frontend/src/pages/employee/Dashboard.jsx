import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../../styles/HolidayCalender.css";
import logo from "../../assets/logo.svg";
import Footer from "../../components/Footer";

const EmployeeDashboard = () => {
  const [username, setUsername] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [clientId, setClientId] = useState(null);
  const [emailId, setEmailId] = useState("");
  const [clientDetails, setClientDetails] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [holidayDates, setHolidayDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("employeeName");
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedClientId = localStorage.getItem("clientId");
    const storedemailId = localStorage.getItem("email");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmployeeId) setEmployeeId(storedEmployeeId);
    if (storedClientId) setClientId(storedClientId);
    if (storedemailId) setEmailId(storedemailId);
  }, []);

  const upcomingHolidayCount = holidays.filter((holiday) => {
    const today = new Date();
    const holidayDate = new Date(holiday.date);
    return holidayDate >= today;
  }).length;
  

  useEffect(() => {
    if (clientId) {
      fetchHolidays(clientId);
      fetchClientDetails(clientId);
    }
  }, [clientId]);

  const fetchClientDetails = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8081/clients/${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch client details");
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
      if (!response.ok) throw new Error("Failed to fetch holidays");
      const data = await response.json();

      const formattedHolidays = data.map(holiday => ({
        title: holiday.holidayName,
        date: holiday.holidayDate,
        reason: holiday.holidayName,
        isHoliday: true,
      }));

      setHolidays(formattedHolidays);
      setHolidayDates(data.map(h => h.holidayDate));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleChangePassword = () => {
    window.location.href = "/change-password";
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <br></br><br></br><br></br>
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
              <a onClick={handleChangePassword}>Change Password</a>
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
            <p><strong>Employee ID:</strong> {employeeId}</p>
            <p><strong>Name:</strong> {username}</p>
            <p><strong>Email ID:</strong> {emailId}</p>
            <p><strong>Client:</strong> {clientDetails?.clientName}</p>
            <p><strong>Designation:</strong> Employee</p>
          </div>
        </div>
      )}
  
      <main className="main-content">
      <div className="dashboard-layout">
      
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
                  }
                }}
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
        <div className="upcoming-holiday-box">
          <h2>Upcoming Holidays</h2>
          <span className="icon">🏖️</span>
          <p>{upcomingHolidayCount}</p>
        </div>
        </div>
      </main>
      <br></br><br></br>
      <Footer/>
    </div>
  );
  
  
};

export default EmployeeDashboard;
