// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Learning Platform
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/home" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/courses" className="nav-links">
              Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/learning-plans" className="nav-links">
              Learning Plans
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/recommendations" className="nav-links">
              Recommendations
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
