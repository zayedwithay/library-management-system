import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import AddBookPage from './pages/AddBookPage';
import MembersPage from './pages/MembersPage';
import AddMemberPage from './pages/AddMemberPage';
import IssueBookPage from './pages/IssueBookPage';
import ReturnBookPage from './pages/ReturnBookPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // Import the HomePage component

// Import other pages as needed
// import LoginPage from './pages/LoginPage';

import './assets/App.css'; // Main CSS file

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container"> {/* Optional container for padding */}
        <Routes>
          <Route path="/" element={<HomePage/>} /> {/* Default route */}
            <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/add" element={<AddBookPage />} />
          {/* Add route for updating a book e.g., /books/edit/:id */}
          <Route path="/members" element={<MembersPage />} />
           <Route path="/members/add" element={<AddMemberPage />} />
           {/* Add route for updating member e.g., /members/edit/:id */}
          <Route path="/issue" element={<IssueBookPage />} />
          <Route path="/return" element={<ReturnBookPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* Add a 404 Not Found route: <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
