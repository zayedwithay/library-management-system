import React, { useState, useEffect } from 'react';
import './Form.css';

// Helper to get date string in YYYY-MM-DD format
const getISODateString = (date) => {
    return date.toISOString().split('T')[0];
}

// Mock function to find transaction and calculate fine - replace with API call
const fetchTransactionDetails = async (transactionId) => {
    // --- TODO: Replace with API call to get transaction by ID ---
    // Example: GET /api/transactions/:id (or a dedicated lookup endpoint)
    console.log("Fetching details for transaction:", transactionId);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    // Mock response - replace with actual data structure from backend
     if (transactionId === "valid123") { // Example valid ID
        return {
            _id: "valid123",
            book: { title: "The Great Gatsby", isbn: "9780743273565" },
            member: { name: "John Doe", memberId: "M001" },
            issueDate: "2025-04-01T00:00:00.000Z", // Example past date
            dueDate: "2025-04-16T00:00:00.000Z", // Example due date
            // returnDate: null, fineAmount: 0, finePaid: false // Initial state
        };
    } else {
        throw new Error("Transaction not found or already returned.");
    }
};

// Mock fine calculation (should match backend)
const calculateFineClientSide = (dueDateStr, returnDateStr) => {
    const dueDate = new Date(dueDateStr); dueDate.setHours(0, 0, 0, 0);
    const returnDate = new Date(returnDateStr); returnDate.setHours(0, 0, 0, 0);
    if (returnDate <= dueDate) return 0;
    const diffTime = Math.abs(returnDate - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 1; //  per day example rate
};


function ReturnForm({ onSubmit }) {
    const [transactionId, setTransactionId] = useState(''); // User enters ID of the *issue* record
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [returnDate, setReturnDate] = useState(getISODateString(new Date()));
    const [calculatedFine, setCalculatedFine] = useState(0);
    const [payFineNow, setPayFineNow] = useState(false); // Checkbox state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // For main submit
    const [lookupLoading, setLookupLoading] = useState(false); // For ID lookup

    // Fetch details when Transaction ID is entered/changes (add debounce later)
    const handleLookup = async () => {
        if (!transactionId) {
            setError("Please enter the Transaction ID of the issued book.");
            setTransactionDetails(null);
            setCalculatedFine(0);
            return;
        }
        setError('');
        setSuccess('');
        setLookupLoading(true);
        setTransactionDetails(null); // Clear old details
         setCalculatedFine(0);
         setPayFineNow(false);


        try {
            const details = await fetchTransactionDetails(transactionId); // Use mock/API call
            setTransactionDetails(details);
             // Calculate initial fine based on default return date (today)
             const fine = calculateFineClientSide(details.dueDate, returnDate);
             setCalculatedFine(fine);
             setPayFineNow(fine > 0); // Default check the box if there's a fine? Or leave unchecked? Spec unclear, let's default to checked if fine exists.

        } catch (err) {
            setError(err.message || "Failed to find transaction details.");
            setTransactionDetails(null);
             setCalculatedFine(0);
        } finally {
            setLookupLoading(false);
        }
    };

    // Recalculate fine if return date changes
     useEffect(() => {
        if (transactionDetails) {
            try {
                const fine = calculateFineClientSide(transactionDetails.dueDate, returnDate);
                setCalculatedFine(fine);
                // Keep payFineNow state as user set it, unless fine becomes 0
                if (fine === 0) setPayFineNow(false);
            } catch(e) {
                console.error("Error calculating fine on date change");
                 setCalculatedFine(0);
                 setPayFineNow(false);
            }
        }
    }, [returnDate, transactionDetails]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!transactionDetails) {
            setError("Please look up a valid transaction first.");
            return;
        }
        setLoading(true);

        // Return Date Validation (Spec: Cannot be future, cannot be before issue date)
        const today = new Date(); today.setHours(0,0,0,0);
        const retDate = new Date(returnDate); retDate.setHours(0,0,0,0);
        const issDate = new Date(transactionDetails.issueDate); issDate.setHours(0,0,0,0);

        if(retDate > today) {
            setError("Return date cannot be in the future.");
            setLoading(false); return;
        }
         if(retDate < issDate) {
            setError("Return date cannot be before the issue date.");
            setLoading(false); return;
        }

        // Fine payment validation (Spec: Checkbox must be selected if fine exists? Ambiguous.)
        // Let's assume return is allowed even if fine exists & checkbox isn't checked.
        // The checkbox only determines if the fine is marked 'paid' in *this* transaction.
        // if (calculatedFine > 0 && !payFineNow) {
        //    setError("The 'Pay Fine Now' checkbox must be selected to complete the return with a pending fine.");
        //    setLoading(false); return;
        // }


        try {
            await onSubmit({
                transactionId: transactionDetails._id, // Pass the ID of the issue transaction
                returnDate: returnDate,
                payFineNow: payFineNow // Send checkbox state
            });
            setSuccess('Book returned successfully!');
            // Clear form after success
            setTransactionId('');
            setTransactionDetails(null);
            setReturnDate(getISODateString(new Date()));
            setCalculatedFine(0);
            setPayFineNow(false);
        } catch (err) {
            setError(err.message || 'Failed to return book.');
        } finally {
             setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Return Book</h2>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <div className="form-group">
                <label htmlFor="transactionId">Issue Transaction ID:</label>
                <div style={{ display: 'flex' }}>
                     <input
                        type="text"
                        id="transactionId"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                        disabled={lookupLoading || loading}
                        style={{ flexGrow: 1, marginRight: '10px' }}
                     />
                     <button type="button" onClick={handleLookup} disabled={lookupLoading || loading || !transactionId} className="form-button">
                         {lookupLoading ? 'Looking up...' : 'Find Transaction'}
                     </button>
                 </div>
            </div>

            {transactionDetails && (
                <div className="transaction-details">
                    <h4>Transaction Details:</h4>
                    <p><strong>Book:</strong> {transactionDetails.book?.title} ({transactionDetails.book?.isbn})</p>
                    <p><strong>Member:</strong> {transactionDetails.member?.name} ({transactionDetails.member?.memberId})</p>
                    <p><strong>Issue Date:</strong> {new Date(transactionDetails.issueDate).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(transactionDetails.dueDate).toLocaleDateString()}</p>

                     <div className="form-group">
                        <label htmlFor="returnDate">Return Date:</label>
                        <input
                            type="date"
                            id="returnDate"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            required
                            disabled={loading}
                            max={getISODateString(new Date())} // Cannot be future
                            min={getISODateString(new Date(transactionDetails.issueDate))} // Cannot be before issue
                        />
                         <small>Auto-populates today. Cannot be future or before issue date.</small>
                    </div>

                    <div className="form-group">
                        <label>Calculated Fine:</label>
                        <p style={{ fontWeight: 'bold', color: calculatedFine > 0 ? 'red' : 'green' }}>
                            ${calculatedFine.toFixed(2)}
                        </p>
                    </div>

                    {calculatedFine > 0 && (
                        <div className="form-group form-check">
                             <input
                                type="checkbox"
                                className="form-check-input"
                                id="payFineNow"
                                checked={payFineNow}
                                onChange={(e) => setPayFineNow(e.target.checked)}
                                disabled={loading}
                            />
                            <label className="form-check-label" htmlFor="payFineNow">
                                Mark Fine as Paid Now? (If unchecked, fine added to member account)
                            </label>
                        </div>
                    )}

                    <button type="submit" className="form-button" disabled={loading || lookupLoading}>
                         {loading ? 'Returning...' : 'Confirm Return'}
                    </button>
                </div>
            )}
        </form>
    );
}

export default ReturnForm;

