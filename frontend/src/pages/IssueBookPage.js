import React from 'react';
import IssueForm from '../components/IssueForm';
import { issueBook } from '../api/transactions';
// Import APIs to fetch books and members if needed for dropdowns
// import { getBooks } from '../api/books';
// import { getMembers } from '../api/members';

function IssueBookPage() {
    // --- TODO: Fetch books and members for selection ---
    // const [books, setBooks] = useState([]);
    // const [members, setMembers] = useState([]);
    // useEffect(() => { fetch data... }, []);

    const handleIssueBook = async (issueData) => {
         try {
             const transaction = await issueBook(issueData);
             console.log("Book issued, transaction:", transaction);
             // Let form handle success message
         } catch (error) {
             console.error("Issue book failed:", error);
             throw error; // Let form handle error message
         }
    };

    return (
        <div>
            {/* <h1>Issue a Book</h1> */}
            <IssueForm
                onSubmit={handleIssueBook}
                // Pass fetched books/members if using dropdowns
                // books={books}
                // members={members}
            />
        </div>
    );
}

export default IssueBookPage;
