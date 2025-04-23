import React from 'react';
import BookForm from '../components/BookForm';
import { addBook } from '../api/books'; // Import the API function
// Optional: Use useNavigate to redirect after adding
// import { useNavigate } from 'react-router-dom';

function AddBookPage() {
    // const navigate = useNavigate(); // For redirecting

    const handleAddBook = async (bookData) => {
        // The API call is wrapped to handle potential errors
        try {
            const newBook = await addBook(bookData);
            console.log("Book added:", newBook);
            // Optional: Redirect to the books list or the new book's detail page
            // navigate('/books');
            // Success message is now handled within BookForm
            // Re-throw is needed for BookForm to show its own success message
            // Or we could return true/false from handleAddBook
        } catch (error) {
             // Error is caught and displayed within BookForm
             console.error("Add book failed:", error);
             // Re-throw the error so BookForm can catch it
             throw error;
        }
    };

    return (
        <div>
            {/* Maybe add a back button Link here */}
            {/* <h1>Add a New Book</h1> */}
            <BookForm onSubmit={handleAddBook} isUpdating={false} />
        </div>
    );
}

export default AddBookPage;
