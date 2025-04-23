import React from 'react';
import MemberForm from '../components/MemberForm';
import { addMember } from '../api/members';

function AddMemberPage() {

    const handleAddMember = async (memberData) => {
         try {
             const newMember = await addMember(memberData);
             console.log("Member added:", newMember);
             // Let form handle success message
             // navigate('/members'); // Optional redirect
         } catch (error) {
             console.error("Add member failed:", error);
             throw error; // Let form handle error message
         }
    };

    return (
        <div>
            {/* <h1>Add a New Member</h1> */}
            <MemberForm onSubmit={handleAddMember} isUpdating={false} />
        </div>
    );
}

export default AddMemberPage;
