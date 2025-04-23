import React, { useState, useEffect } from 'react';
import './Form.css';

// Helper to get date string in YYYY-MM-DD format
const getISODateString = (date) => {
    return date.toISOString().split('T')[0];
}

// Helper to calculate default due date (15 days ahead)
const getDefaultDueDate = (issueDateStr) => {
     const date = new Date(issueDateStr);
     date.setDate(date.getDate() + 15);
     return getISODateString(date);
}

function IssueForm({ onSubmit /*, books = [], members = [] */ }) {
    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [issueDate, setIssueDate] = useState(getISODateString(new Date()));
    const [dueDate, setDueDate] = useState(getDefaultDueDate(issueDate)); // Auto-calc based on issue date
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Adjust default due date if issue date changes
    useEffect(() => {
        try {
            const minDueDate = new Date(issueDate);
            minDueDate.setDate(minDueDate.getDate() + 15); // Calculate min +15 days
            const currentDueDate = new Date(dueDate);

            // Auto-update due date if issue date changes, ensuring it respects the minimum +15 rule
            // (This logic might need refinement based on exact spec interpretation of "edit earlier")
            // Let's just set default for now when issueDate changes
             setDueDate(getDefaultDueDate(issueDate));

        } catch (e) {
            console.error("Error processing dates");
            setDueDate(''); // Reset if issue date is invalid
        }

    }, [issueDate]);

     // --- TODO: Fetch books and members for dropdowns/search ---
     // useEffect(() => { fetch data... }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!selectedBookId || !selectedMemberId || !issueDate || !dueDate) {
            setError('Please select a book, a member, and ensure dates are valid.');
            setLoading(false);
            return;
        }

        // Date Validations based on spec
        const today = new Date(); today.setHours(0,0,0,0); // Normalize today
        const issDate = new Date(issueDate); issDate.setHours(0,0,0,0); // Normalize
        const dDate = new Date(dueDate); dDate.setHours(0,0,0,0); // Normalize

        if (issDate > today) {
            setError('Issue date cannot be in the future.');
            setLoading(false); return;
        }

        const maxDueDate = new Date(issueDate);
        maxDueDate.setDate(maxDueDate.getDate() + 15);
        maxDueDate.setHours(0,0,0,0); // Normalize

        if (dDate > maxDueDate) {
            setError('Due date cannot be more than 15 days after the issue date.');
             setLoading(false); return;
        }
         if (dDate < issDate) {
             setError('Due date cannot be before the issue date.');
             setLoading(false); return;
         }
         // Spec says "can be edited to a date earlier than that" (that = +15 days)
         // The checks above enforce this. It must be >= issue date AND <= issue date + 15.


        try {
            await onSubmit({
                bookId: selectedBookId,
                memberId: selectedMemberId,
                issueDate: issueDate,
                dueDate: dueDate
            });
            setSuccess('Book issued successfully!');
            // Clear form
            setSelectedBookId('');
            setSelectedMemberId('');
            setIssueDate(getISODateString(new Date()));
            // Due date will reset via useEffect
        } catch (err) {
            setError(err.message || 'Failed to issue book.');
        } finally {
             setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Issue Book</h2>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            {/* --- TODO: Replace with actual Book Search/Dropdown --- */}
            <div className="form-group">
                <label htmlFor="book">Book (Select/Search):</label>
                <input type="text" placeholder="Enter Book ID or Search Title/ISBN" value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)} required disabled={loading}/>
                {/* <select id="book" value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} required disabled={loading}>
                    <option value="">-- Select Book --</option>
                    {books.map(book => <option key={book._id} value={book._id}>{book.title} ({book.isbn})</option>)}
                </select> */}
            </div>

            {/* --- TODO: Replace with actual Member Search/Dropdown --- */}
            <div className="form-group">
                <label htmlFor="member">Member (Select/Search):</label>
                 <input type="text" placeholder="Enter Member ID or Search Name" value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)} required disabled={loading}/>
                {/* <select id="member" value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} required disabled={loading}>
                    <option value="">-- Select Member --</option>
                     {members.map(member => <option key={member._id} value={member._id}>{member.name} ({member.memberId})</option>)}
                </select> */}
            </div>

            <div className="form-group">
                <label htmlFor="issueDate">Issue Date:</label>
                <input type="date" id="issueDate" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required disabled={loading} max={getISODateString(new Date())} />
                 <small>Cannot be future date.</small>
            </div>

             <div className="form-group">
                <label htmlFor="dueDate">Due Date:</label>
                <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required disabled={loading}/>
                 <small>Auto-populates +15 days. Max +15 days from issue date. Min issue date.</small>
            </div>

            <button type="submit" className="form-button" disabled={loading}>
                 {loading ? 'Issuing...' : 'Issue Book'}
            </button>
        </form>
    );
}

export default IssueForm;
