import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUserTie, FaUsers } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          {/* Admin Dashboard as Home */}
          <li>
            <NavLink exact to="/admin/dashboard" activeClassName="active">
              <FaHome className="icon" /> Home
            </NavLink>
          </li>

          {/* HR Management */}
          <li>
            <NavLink to="/admin/hr-management" activeClassName="active">
              <FaUserTie className="icon" /> HR Management
            </NavLink>
          </li>

          {/* Employee Management */}
          <li>
            <NavLink to="/admin/employee-management" activeClassName="active">
              <FaUsers className="icon" /> Employee Management
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
