import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../../styles/HolidayCalender.css";
import Footer from "../../components/Footer";
import Header from "../../components/DashboardHeader";

const EmployeeDashboard = () => {
  const [username, setUsername] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [clientId, setClientId] = useState(null);
  const [emailId, setEmailId] = useState("");
  const [designation, setDesignation] = useState("");
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
    const storedDesignation = localStorage.getItem("userRole");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmployeeId) setEmployeeId(storedEmployeeId);
    if (storedClientId) setClientId(storedClientId);
    if (storedemailId) setEmailId(storedemailId);
    if (storedDesignation) setDesignation(storedDesignation);
  }, []);

  const upcomingHolidayCount = holidays.filter((holiday) => {
    const today = new Date();
    const holidayDate = new Date(holiday.date);
    return holidayDate >= today;
  }).length;
  
  const upcomingHolidaysList = holidays
    .filter((holiday) => {
      const today = new Date();
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
     

  useEffect(() => {
    if (clientId) {
      fetchHolidays(clientId);
      fetchClientDetails(clientId);
    }else {
    setLoading(false);
  }
  }, [clientId]);

  const fetchClientDetails = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8888/clients/${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch client details");
      const data = await response.json();
      setClientDetails(data);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

 const fetchHolidays = async (clientId) => {
  try {
    setLoading(true); 
    const response = await fetch(`http://localhost:8888/holidays/client/${clientId}`);
    if (!response.ok) throw new Error("Failed to fetch holidays");

    const data = await response.json();

    if (Array.isArray(data) && data.length === 0) {
      setHolidays([]); 
      setHolidayDates([]);
    } else {
      const formattedHolidays = data.map((holiday) => ({
        title: holiday.holidayName,
        date: holiday.holidayDate,
        reason: holiday.holidayName,
        isHoliday: true,
      }));
      setHolidays(formattedHolidays);
      setHolidayDates(data.map((h) => h.holidayDate));
    }

  } catch (err) {
    setError(err.message);
    setHolidays([]);
    setHolidayDates([]);
  } finally {
    setLoading(false); // ensure loading stops
  }
};


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  
    

  return (
    <div className="dashboard-container">
      {/* Header */}
      <br></br><br></br><br></br>
      <header className="dashboard-header">
        <Header
        onLogout={handleLogout}
        onProfileClick={() => setShowProfileOverlay(true)}
        />
      </header>
  
      {showProfileOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowProfileOverlay(false)}>X</button>
            <div className="overlay-title">Profile Details</div>
            <p><strong>Employee ID:</strong> {employeeId}</p>
            <p><strong>Name:</strong> {username}</p>
            <p><strong>Email ID:</strong> {emailId}</p>
            <p><strong>Client:</strong> {clientDetails?.clientName || "-"}</p>
            <p><strong>Designation:</strong> {designation}</p>
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
          ) : holidays.length === 0 ? (
            <p className="error">No holidays found </p>
          ) : (
            <div className="calendar-container">
              
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={holidays}
                eventContent={() => null}
                buttonText={{
                  today: "Today"
                }}
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
          <p>{upcomingHolidayCount}</p>
          
          {upcomingHolidayCount > 0 && (
            <div className="upcoming-holidays-list">
              <h3>Next Holidays</h3>
              <ul>
                {upcomingHolidaysList.map((holiday, index) => (
                  <li key={index}>
                    <span className="holiday-date">
                      {new Date(holiday.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="holiday-name">{holiday.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        </div>
      </main>
      <br></br><br></br>
      <Footer/>
    </div>
  );
  
  
};

export default EmployeeDashboard;
