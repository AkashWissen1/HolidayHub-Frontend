import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import "../../styles/EmployeeSearch.css";
import { FaSearch } from "react-icons/fa";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Header from "../../components/DashboardHeader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";

const API_BASE_URL = "http://localhost:8084/hr/search/client";

const ClientSearch = () => {
  const [clientName, setClientName] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tooltipData, setTooltipData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [clientDetails, setClientDetails] = useState({});
  const [username, setUsername] = useState("");
  const [empId, setEmpId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [clientMap, setClientMap] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("employeeName");
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedEmailId = localStorage.getItem("email");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmployeeId) setEmpId(storedEmployeeId);
    if (storedEmailId) setEmailId(storedEmailId);

    // Fetch all clients (names and IDs)
    fetch("http://localhost:8081/clients")
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((client) => {
          map[client.clientName] = client.id;
        });
        setClientMap(map);
      })
      .catch((err) => console.error("Failed to fetch client names", err));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setClientName(value);

    if (value.length > 0) {
      const filtered = Object.keys(clientMap).filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestedName) => {
    setClientName(suggestedName);
    setSuggestions([]);
    handleSearch(suggestedName);
  };

  const handleSearch = async (name = clientName) => {
    if (!name || !clientMap[name]) {
      setError("Please enter a valid Client Name.");
      setHolidays([]);
      setClientDetails({});
      return;
    }

    const clientId = clientMap[name];
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/${name}`);
      if (!response.ok) throw new Error("Holidays not found.");
      const data = await response.json();

      const formattedHolidays = data.map((holiday) => ({
        title: holiday.holidayName,
        start: holiday.holidayDate,
        reason: holiday.holidayName,
      }));

      setHolidays(formattedHolidays);
      fetchClientDetails(clientId);
    } catch (err) {
      setHolidays([]);
      setClientDetails({});
      setError(err.message || "Something went wrong.");
    }
    setLoading(false);
  };

  const fetchClientDetails = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8081/clients/${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch client details");
      const clientData = await response.json();
      setClientDetails(clientData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleDownloadPDF = () => {
      const doc = new jsPDF();
    
      const img = new Image();
      img.src = logo;
    
      img.onload = () => {
        doc.addImage(img, "PNG", 14, 10, 50, 30);
    
        
        doc.setFont("times", "normal");
        doc.setFontSize(18);
        const pageWidth = doc.internal.pageSize.getWidth();
        const title = "Holiday List";
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
        doc.text(title, titleX, 25);
    
        doc.setFontSize(12);
        doc.text(`Client ID: ${clientDetails.id}`, 14, 45);
        doc.text(`Client Name: ${clientDetails.clientName}`, 14, 52);
        doc.text(`Email ID: ${clientDetails.contactEmail}`, 14, 59);
        doc.text(`Contact Person: ${clientDetails.contactPerson}`, 14, 66);
    
        
        const tableColumn = ["S.No", "Date", "Reason"];
        const tableRows = holidays
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .map((holiday, index) => [
            index + 1, 
            new Date(holiday.start).toLocaleDateString(),
            holiday.title,
          ]);
    
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 74,
          styles: {
            fontSize: 11,
            font: "times",
            textColor: 0,
            cellPadding: 4,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [0, 123, 255],
            textColor: 255,
            halign: "center",
            valign: "middle",
          },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.1,
        });
    
        
        const margin = 5;
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setLineWidth(0.5);
        doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    
        doc.save("Holiday_List.pdf");
      };
    };
  

  const holidayDates = holidays.map((h) => h.start);

  return (
    <div className="employee-search-container">
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
          <div className="search-section" style={{ position: 'relative' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Enter Client Name..."
              value={clientName}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <button className="search-button" onClick={() => handleSearch()}>
              <FaSearch /> Search
            </button>

            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {loading ? (
            <p className="loading-text">Loading holidays...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : holidays.length > 0 ? (
            <div className="calendar-client-wrapper">
              <div className="calendar-box">
              <button onClick={handleDownloadPDF} className="pdf">📄 Download PDF</button>
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
                      {new Date(tooltipData.date).toLocaleString("en-US", { month: "long" })}
                    </div>
                    <div className="tooltip-date">
                      {new Date(tooltipData.date).getDate()}
                    </div>
                    <div className="tooltip-reason">{tooltipData.reason}</div>
                  </div>
                )}
              </div>

              <div className="employee-info-box">
                <h3>Client Details</h3>
                <p><strong>Client ID:</strong> {clientDetails.id}</p>
                <p><strong>Client Name:</strong> {clientDetails.clientName}</p>
                <p><strong>Email ID:</strong> {clientDetails.contactEmail}</p>
                <p><strong>Contact Person:</strong> {clientDetails.contactPerson}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientSearch;
