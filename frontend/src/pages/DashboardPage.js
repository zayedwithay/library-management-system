import React from 'react';

function DashboardPage() {
    // TODO: Fetch summary data (total books, members, books issued, overdue books etc.)
    return (
        <div>
            <h1>Library Dashboard</h1>
            <p>Welcome to the Library Management System.</p>
            {/* Display summary stats here */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                <div style={styles.statBox}>
                    <h2>Books</h2>
                    <p>Total: 1524</p>
                    <p>Available: 1249</p>
                </div>
                 <div style={styles.statBox}>
                    <h2>Members</h2>
                    <p>Active: 652</p>
                 </div>
                <div style={styles.statBox}>
                     <h2>Activity</h2>
                     <p>Books Issued: 265</p>
                     <p>Overdue: 102</p>
                </div>
            </div>
        </div>
    );
}

// Basic inline styles for stat boxes
const styles = {
    statBox: {
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        flex: 1, // Make boxes share space
        textAlign: 'center',
         boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }
}

export default DashboardPage;
