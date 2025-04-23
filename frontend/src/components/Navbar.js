import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Create basic CSS for styling

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Library MS</Link>
      <ul className="navbar-links">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/books">Books</Link></li>
         <li><Link to="/books/add">Add Book</Link></li>
        <li><Link to="/members">Members</Link></li>
         <li><Link to="/members/add">Add Member</Link></li>
        <li><Link to="/issue">Issue Book</Link></li>
        <li><Link to="/return">Return Book</Link></li>
        {/* Add Login/Logout links later */}
        {/* <li><Link to="/login">Login</Link></li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
