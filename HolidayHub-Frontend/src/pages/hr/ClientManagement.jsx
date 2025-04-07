import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import "../../styles/ClientManagement.css";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSort } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8081/clients";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ clientName: "", contactPerson: "", contactEmail: "" });
  const [editingClient, setEditingClient] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}`)
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingClient({ ...editingClient, [e.target.name]: e.target.value });
  };

  const addClient = () => {
    if (!newClient.clientName || !newClient.contactPerson || !newClient.contactEmail) return;

    fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    })
      .then((response) => response.json())
      .then((data) => {
        setClients([...clients, data]);
        setNewClient({ clientName: "", contactPerson: "", contactEmail: "" });
        setShowAddForm(false);
      })
      .catch((error) => console.error("Error adding client:", error));
  };

  const updateClient = () => {
    const dto = {
      clientId: editingClient.id, // ✅ fix: match backend DTO field
      clientName: editingClient.clientName,
      contactPerson: editingClient.contactPerson,
      contactEmail: editingClient.contactEmail
    };

    fetch(`${API_BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Update failed");
        }
        return response.json();
      })
      .then((updatedClient) => {
        setClients(clients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        ));
        setEditingClient(null);
        setShowEditForm(false);
      })
      .catch((error) => console.error("Error updating client:", error));
  };

  const deleteClient = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      fetch(`${API_BASE_URL}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Delete failed");
          }
          setClients(clients.filter((client) => client.id !== id));
        })
        .catch((error) => console.error("Error deleting client:", error));
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`client-management-container ${showAddForm || showEditForm ? "blur-background" : ""}`}>
      <Header />
      <div className="client-management-content">
        <Sidebar />
        <div className="client-management">
          <div className="client-header">
            <h2 className="client-list-title">Client List</h2>
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
              <button className="add-client-btn" onClick={() => setShowAddForm(true)}>
                <FaPlus /> ADD NEW CLIENT
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Client ID <FaSort /></th>
                <th>Client Name <FaSort /></th>
                <th>Contact Person</th>
                <th>Contact Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.clientName}</td>
                    <td>{client.contactPerson}</td>
                    <td>{client.contactEmail}</td>
                    <td>
                      <button onClick={() => { setEditingClient(client); setShowEditForm(true); }} className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteClient(client.id)} className="delete-btn">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No clients found.</td></tr>
              )}
            </tbody>
          </table>

          {/* Add Client Modal */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">ADD CLIENT</h2>
                <p>Enter the client details to add</p>
                <div className="modal-form">
                  <label>Name</label>
                  <input type="text" name="clientName" value={newClient.clientName} onChange={handleInputChange} />

                  <label>Contact Person</label>
                  <input type="text" name="contactPerson" value={newClient.contactPerson} onChange={handleInputChange} />

                  <label>Contact Email</label>
                  <input type="email" name="contactEmail" value={newClient.contactEmail} onChange={handleInputChange} />

                  <button className="save-btn" onClick={addClient}>ADD CLIENT</button>
                  <button className="cancel-btn" onClick={() => setShowAddForm(false)}>CANCEL</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Client Modal */}
          {showEditForm && editingClient && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">UPDATE CLIENT</h2>
                <p>Update client details below</p>
                <div className="modal-form">
                  <label>Client ID</label>
                  <input type="text" value={editingClient.id} disabled />

                  <label>Name</label>
                  <input type="text" name="clientName" value={editingClient.clientName} onChange={handleEditInputChange} />

                  <label>Contact Person</label>
                  <input type="text" name="contactPerson" value={editingClient.contactPerson} onChange={handleEditInputChange} />

                  <label>Contact Email</label>
                  <input type="email" name="contactEmail" value={editingClient.contactEmail} onChange={handleEditInputChange} />

                  <button className="save-btn" onClick={updateClient}>UPDATE CLIENT</button>
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

export default ClientManagement;
