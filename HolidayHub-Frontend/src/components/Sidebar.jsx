import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUserTie, FaUsers, FaCalendarAlt, FaUserCheck, FaSearch } from "react-icons/fa";
import "../styles/Sidebar.css"; // Ensure your styles are properly linked

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          {/* Home */}
          <li>
            <NavLink exact to="/" activeClassName="active">
              <FaHome className="icon" /> Home
            </NavLink>
          </li>

          {/* Search Options */}
          <li>
            <NavLink to="/search-by-employee" activeClassName="active">
              <FaSearch className="icon" /> Search By Employee ID
            </NavLink>
          </li>
          <li>
            <NavLink to="/search-by-client" activeClassName="active">
              <FaSearch className="icon" /> Search By Client Name
            </NavLink>
          </li>

          {/* Management Sections */}
          <li>
            <NavLink to="/hr/clients" activeClassName="active">
              <FaUserTie className="icon" /> Client Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/employee-management" activeClassName="active">
              <FaUsers className="icon" /> Employee Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/holiday-management" activeClassName="active">
              <FaCalendarAlt className="icon" /> Holiday Management
            </NavLink>
          </li>

          {/* Assign Client */}
          <li>
            <NavLink to="/assign-client" activeClassName="active">
              <FaUserCheck className="icon" /> Assign Client
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
