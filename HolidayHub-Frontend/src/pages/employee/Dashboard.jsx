import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./HolidayCalender.css";
import "../../styles/Header.css";
import logo from "../../assets/logo.svg"; 

const EmployeeDashboard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const holidays = [
    { title: "Tamil New Year", date: "2025-04-14", reason: "Tamil New Year" },
    { title: "New Year's Day", date: "2025-01-01", reason: "Start of the New Year" },
    { title: "Republic Day", date: "2025-01-26", reason: "National Holiday" },
    { title: "Independence Day", date: "2025-08-15", reason: "Freedom Celebration" },
  ];

  const [tooltipData, setTooltipData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
    window.location.href = "/login"; // Redirect to login page
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
        <a href="/profile">View Profile</a>
        <a onClick={handleLogout}>Logout</a>
      </div>
    </div>
  </div>
</header>


      {/* Greeting and Calendar Section */}
      <div className="holiday-dashboard">
        <h1 className="greeting">Welcome, {username}</h1>
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
      </div>
    </div>
  );
};

export default EmployeeDashboard;
