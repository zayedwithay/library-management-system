import React from 'react'

function home() {
  return (
    <div style={{ marginTop: '80px' }}> 
        <h1>Welcome to Library Management System</h1>
        <p>Simple fullstack web application to manage library books and members.</p>
        <p>Use the navigation bar to access different sections of the application.</p>
        <p>Created by Zayed Alam (A7605221197)</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
        >
          Go to Login Page
        </button>
    </div>
  )
}

export default home