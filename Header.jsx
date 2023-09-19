/* Header.jsx */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Import the CSS file for styling
import UserContext from './UserContext';

const Header = () => {
  const user = useContext(UserContext);

  return (
    <header className="header">
      <Link to="/"> {/* Add Link component here with "to" prop set to "/" */}
        <div className="logo-container">
          <img src="logo.jpeg" alt="Fantasy Basketball Logo" className="logo"/>
          <h1 className="app-title">Fantasy College Hoops</h1>
          {user && user.username ? (
            <div className="greeting">Hello, {user.username}</div>
          ) : null}
        </div>
      </Link>
      <nav className="navigation">
        <ul className="nav-links">
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/fantasy-draft">Fantasy Draft</Link>
          </li>
          <li>
            <Link to="/my-leagues">My Leagues</Link>
          </li>
          <li>
            <Link to="/team-management">Team Management</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
