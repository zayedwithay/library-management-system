import React, { useState, useEffect } from 'react';
import MemberList from '../components/MemberList';
import { getMembers } from '../api/members'; // Import API functions
import { Link } from 'react-router-dom';

function MembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getMembers();
            setMembers(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch members.');
        } finally {
            setLoading(false);
        }
    };

     // TODO: Implement Edit/Manage functionality
     const handleEdit = (member) => {
         console.log("Manage member:", member);
         // navigate(`/members/edit/${member._id}`); // Requires useNavigate hook
          alert("Manage/Edit functionality not implemented yet.");
     };

    return (
        <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h1>Manage Members</h1>
                  <Link to="/members/add" style={{ textDecoration: 'none' }}>
                     <button>Add New Member</button>
                 </Link>
             </div>
            <MemberList
                members={members}
                onEdit={handleEdit}
                loading={loading}
                error={error}
             />
        </div>
    );
}

export default MembersPage;
