import React from 'react';
import './List.css';

function MemberList({ members = [], onEdit, loading, error }) {

     if (loading) {
        return <p>Loading members...</p>;
    }

    if (error) {
        return <p className="list-error">Error loading members: {error}</p>;
    }

     if (members.length === 0) {
        return <p>No members found.</p>;
    }

    return (
        <div className="list-container">
            <h2>Member List</h2>
             <table className="list-table">
                 <thead>
                    <tr>
                        <th>Name</th>
                        <th>Member ID</th>
                        <th>Email</th>
                        <th>Membership</th>
                         <th>Expiry Date</th>
                        <th>Fines Due</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                 <tbody>
                    {members.map(member => (
                        <tr key={member._id}>
                            <td>{member.name}</td>
                            <td>{member.memberId}</td>
                            <td>{member.email}</td>
                             <td>{member.membershipType}</td>
                             <td>{member.membershipExpiryDate ? new Date(member.membershipExpiryDate).toLocaleDateString() : 'N/A'}</td>
                            <td>${(member.totalFinesDue || 0).toFixed(2)}</td>
                             <td>
                                 {/* <button onClick={() => onEdit(member)} className="list-button-edit">Manage</button> */}
                                 {/* Add Pay Fine Button? */}
                                 <span>Manage</span>
                             </td>
                        </tr>
                    ))}
                 </tbody>
             </table>
        </div>
    );
}

export default MemberList;
