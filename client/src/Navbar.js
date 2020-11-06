import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
function Navbar({ account }) {
  return (
    <div className="navbar">
      <Link to="/">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </Link>
      {account && <p>{account}</p>}
    </div>
  );
}

export default Navbar;
