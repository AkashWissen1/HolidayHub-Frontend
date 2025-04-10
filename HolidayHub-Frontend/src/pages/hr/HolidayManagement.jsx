import React, { useState, useEffect } from "react"; 
import DashboardHeader from "../../components/DashboardHeader";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import "../../styles/ClientManagement.css";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const CLIENT_API = "http://localhost:8081/clients";
const HOLIDAY_API = "http://localhost:8082/holidays";

const HolidayManagement = () => {
  const [clients, setClients] = useState([]);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [showHolidays, setShowHolidays] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [newHoliday, setNewHoliday] = useState({ holidayName: "", holidayDate: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
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
    

  useEffect(() => {
    fetch(CLIENT_API)
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const fetchHolidays = (clientId) => {
    fetch(`${HOLIDAY_API}/client/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        setHolidays(data);
        setSelectedClient(clientId);
        setShowHolidays(true);
      });
  };

  const handleHolidayInput = (e) => {
    setNewHoliday({ ...newHoliday, [e.target.name]: e.target.value });
  };

  const handleEditInput = (e) => {
    setEditingHoliday({ ...editingHoliday, [e.target.name]: e.target.value });
  };

  const addHoliday = () => {
    const dto = { ...newHoliday, clientId: selectedClient };

    fetch(`${HOLIDAY_API}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    })
      .then((res) => res.json())
      .then((data) => {
        setHolidays([...holidays, data]);
        setNewHoliday({ holidayName: "", holidayDate: "" });
        setShowAddForm(false);
      });
  };

  const updateHoliday = () => {
    const dto = {
      holidayId: editingHoliday.id,
      clientId: selectedClient,
      holidayName: editingHoliday.holidayName,
      holidayDate: editingHoliday.holidayDate,
    };

    fetch(`${HOLIDAY_API}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    })
      .then((res) => res.json())
      .then((updated) => {
        const updatedList = holidays.map((h) =>
          h.id === updated.id ? updated : h
        );
        setHolidays(updatedList);
        setShowEditForm(false);
        setEditingHoliday(null);
      });
  };

  const deleteHoliday = (id) => {
    if (window.confirm("Delete this holiday?")) {
      fetch(`${HOLIDAY_API}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holidayId: id }),
      }).then(() => {
        setHolidays(holidays.filter((h) => h.id !== id));
      });
    }
  };

  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const filteredHolidays = holidays.filter((holiday) =>
    holiday.holidayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  
  return (
    <div className={`client-management-container ${showAddForm || showEditForm ? "blur-background" : ""}`}>
      <DashboardHeader
        onLogout={handleLogout}
        onProfileClick={() => setShowProfileOverlay(true)}
      />

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
      <div className="client-management-content">
        <Sidebar />
        <div className="client-management">
          <div className="client-header">
            <h2 className="client-list-title">Client List</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Client Name</th>
                <th>Contact Person</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.clientName}</td>
                  <td>{client.contactPerson}</td>
                  <td>
                    <button className="add-client-btn" onClick={() => fetchHolidays(client.id)}>
                      SHOW HOLIDAYS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showHolidays && (
            <>
              <div className="client-header" style={{ marginTop: "30px" }}>
                <h2 className="client-list-title">Holiday List</h2>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                  </div>
                  <button className="add-client-btn" onClick={() => setShowAddForm(true)}>
                    <FaPlus /> ADD HOLIDAY
                  </button>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Holiday Name</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHolidays.length > 0 ? (
                    filteredHolidays.map((h) => (
                      <tr key={h.id}>
                        <td>{h.id}</td>
                        <td>{h.holidayName}</td>
                        <td>{h.holidayDate}</td>
                        <td>
                          <button className="edit-btn" onClick={() => { setEditingHoliday(h); setShowEditForm(true); }}>
                            <FaEdit />
                          </button>
                          <button className="delete-btn" onClick={() => deleteHoliday(h.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No holidays found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Add Modal */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">ADD HOLIDAY</h2>
                <div className="modal-form">
                  <label>Holiday Name</label>
                  <input name="holidayName" value={newHoliday.holidayName} onChange={handleHolidayInput} />
                  <label>Holiday Date</label>
                  <input type="date" name="holidayDate" value={newHoliday.holidayDate} onChange={handleHolidayInput} />
                  <button className="save-btn" onClick={addHoliday}>SAVE</button>
                  <button className="cancel-btn" onClick={() => setShowAddForm(false)}>CANCEL</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditForm && editingHoliday && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">UPDATE HOLIDAY</h2>
                <div className="modal-form">
                  <label>ID</label>
                  <input type="text" value={editingHoliday.id} disabled />
                  <label>Holiday Name</label>
                  <input name="holidayName" value={editingHoliday.holidayName} onChange={handleEditInput} />
                  <label>Holiday Date</label>
                  <input type="date" name="holidayDate" value={editingHoliday.holidayDate} onChange={handleEditInput} />
                  <button className="save-btn" onClick={updateHoliday}>UPDATE</button>
                  <button className="cancel-btn" onClick={() => setShowEditForm(false)}>CANCEL</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HolidayManagement;
