import React, { useState, useEffect } from 'react';
import './Form.css';

function MemberForm({ onSubmit, initialData = null, isUpdating = false }) {
    const [name, setName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [email, setEmail] = useState('');
    const [membershipType, setMembershipType] = useState('6 months'); // Default from spec
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

     useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setMemberId(initialData.memberId || '');
            setEmail(initialData.email || '');
            setMembershipType(initialData.membershipType || '6 months');
        } else {
            setName('');
            setMemberId('');
            setEmail('');
            setMembershipType('6 months');
        }
        setError('');
        setSuccess('');
    }, [initialData, isUpdating]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Basic Validation
        if (!name || !email || (!isUpdating && !memberId) || !membershipType) {
             setError(`Please fill in all required fields ${isUpdating ? '(Name, Email, Membership)' : '(Name, Member ID, Email, Membership)'}.`);
             setLoading(false);
            return;
        }
         if (isUpdating && !membershipType) {
            setError('Please select a membership action (extend/cancel).');
            setLoading(false);
            return;
        }

        const memberData = { name, email, membershipType };
        if (!isUpdating) {
            memberData.memberId = memberId;
        }

        try {
            await onSubmit(memberData);
            setSuccess(`Member ${isUpdating ? 'updated' : 'added'} successfully!`);
            if (!isUpdating) {
                setName('');
                setMemberId('');
                setEmail('');
                setMembershipType('6 months');
            }
        } catch (err) {
            setError(err.message || `Failed to ${isUpdating ? 'update' : 'add'} member.`);
        } finally {
             setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>{isUpdating ? 'Update Member Membership' : 'Add New Member'}</h2>
             {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
            </div>

             {!isUpdating && (
                <div className="form-group">
                    <label htmlFor="memberId">Member ID:</label>
                    <input type="text" id="memberId" value={memberId} onChange={(e) => setMemberId(e.target.value)} required disabled={loading}/>
                </div>
            )}
            {isUpdating && initialData?.memberId && (
                 <div className="form-group">
                    <label>Member ID:</label>
                    <input type="text" value={initialData.memberId} readOnly disabled />
                 </div>
            )}


            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>

             <div className="form-group">
                 <label htmlFor="membershipType">{isUpdating ? 'Membership Action:' : 'Initial Membership:'}</label>
                <select id="membershipType" value={membershipType} onChange={(e) => setMembershipType(e.target.value)} required disabled={loading}>
                    {isUpdating ? (
                        <>
                             <option value="6 months">Extend by 6 months (Default)</option>
                             <option value="1 year">Extend by 1 year</option>
                             <option value="2 years">Extend by 2 years</option>
                             <option value="cancel">Cancel Membership</option>
                        </>
                    ) : (
                         <>
                            <option value="6 months">6 Months (Default)</option>
                            <option value="1 year">1 Year</option>
                            <option value="2 years">2 Years</option>
                         </>
                    )}

                </select>
             </div>

            <button type="submit" className="form-button" disabled={loading}>
                {loading ? 'Saving...' : (isUpdating ? 'Update Membership' : 'Add Member')}
            </button>
        </form>
    );
}

export default MemberForm;
