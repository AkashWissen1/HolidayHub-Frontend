import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import "../../styles/EmployeeManagement.css";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSort } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8085/employees";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employeeName: "",
    designation: "",
    email: "",
    password: "Wissen@123",
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ Show only those with designation "Employee"
        const filtered = data.filter(emp => emp.designation === "Employee");
        setEmployees(filtered);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingEmployee({ ...editingEmployee, [e.target.name]: e.target.value });
  };

  const addEmployee = () => {
    const { employeeName, designation, email } = newEmployee;
    if (!employeeName || !designation || !email) return;

    const payload = {
      ...newEmployee,
      clientId: null, // Send clientId as null
    };

    fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.designation === "Employee") {
          setEmployees([...employees, data]);
        }
        setNewEmployee({
          employeeName: "",
          designation: "",
          email: "",
          password: "Wissen@123",
        });
        setShowAddForm(false);
      })
      .catch((err) => console.error("Error adding employee:", err));
  };

  const updateEmployee = () => {
    const updatedBody = {
      employeeName: editingEmployee.employeeName,
      designation: editingEmployee.designation,
      email: editingEmployee.email,
      clientId: editingEmployee.clientId || null,
    };

    fetch(`${API_BASE_URL}/update-employee/${editingEmployee.employeeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBody),
    })
      .then((res) => res.json())
      .then((updated) => {
        const updatedList = employees.map((emp) =>
          emp.employeeId === editingEmployee.employeeId ? { ...emp, ...updatedBody } : emp
        );
        // Only keep employees with designation "Employee"
        setEmployees(updatedList.filter(emp => emp.designation === "Employee"));
        setEditingEmployee(null);
        setShowEditForm(false);
      })
      .catch((err) => console.error("Error updating employee:", err));
  };

  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Delete failed");
          setEmployees(employees.filter((emp) => emp.employeeId !== id));
        })
        .catch((err) => console.error("Error deleting employee:", err));
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`client-management-container ${
        showAddForm || showEditForm ? "blur-background" : ""
      }`}
    >
      <Header />
      <div className="client-management-content">
        <Sidebar />
        <div className="client-management">
          <div className="client-header">
            <h2 className="client-list-title">Employee List</h2>
            <div className="client-header-actions">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              <button
                className="add-client-btn"
                onClick={() => setShowAddForm(true)}
              >
                <FaPlus /> ADD NEW EMPLOYEE
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID <FaSort /></th>
                <th>Name <FaSort /></th>
                <th>Designation</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.email}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingEmployee(emp);
                          setShowEditForm(true);
                        }}
                        className="edit-btn"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.employeeId)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Add Modal */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">ADD EMPLOYEE</h2>
                <div className="modal-form">
                  <label>Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={newEmployee.employeeName}
                    onChange={handleInputChange}
                  />

                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={newEmployee.designation}
                    onChange={handleInputChange}
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                  />

                  <label>Password (default)</label>
                  <input
                    type="text"
                    name="password"
                    value={newEmployee.password}
                    disabled
                  />

                  <button className="save-btn" onClick={addEmployee}>
                    ADD EMPLOYEE
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setShowAddForm(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditForm && editingEmployee && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">UPDATE EMPLOYEE</h2>
                <div className="modal-form">
                  <label>ID</label>
                  <input
                    type="text"
                    value={editingEmployee.employeeId}
                    disabled
                  />

                  <label>Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={editingEmployee.employeeName}
                    onChange={handleEditInputChange}
                  />

                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={editingEmployee.designation}
                    onChange={handleEditInputChange}
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editingEmployee.email}
                    onChange={handleEditInputChange}
                  />

                  <button className="save-btn" onClick={updateEmployee}>
                    UPDATE EMPLOYEE
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setShowEditForm(false)}
                  >
                    CANCEL
                  </button>
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

export default EmployeeManagement;
