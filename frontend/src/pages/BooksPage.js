import React, { useState, useEffect } from 'react';
import BookList from '../components/BookList';
import { getBooks, deleteBook } from '../api/books'; // Import API functions
import { Link } from 'react-router-dom';

function BooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
         setLoading(true);
         setError('');
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch books.');
        } finally {
             setLoading(false);
        }
    };

     const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
             try {
                 await deleteBook(id);
                 // Refresh the list after successful deletion
                 fetchBooks();
                 alert('Book deleted successfully'); // Simple feedback
             } catch (err) {
                 setError(err.message || 'Failed to delete book.');
                 alert(`Error deleting book: ${err.message || 'Unknown error'}`);
             }
         }
     };

     // TODO: Implement Edit functionality (likely involves navigating to an EditBookPage)
     const handleEdit = (book) => {
         console.log("Edit book:", book);
         // navigate(`/books/edit/${book._id}`); // Requires useNavigate hook
         alert("Edit functionality not implemented yet.");
     };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manage Books</h1>
                 <Link to="/books/add" style={{ textDecoration: 'none' }}>
                     <button>Add New Book</button>
                 </Link>
             </div>
             {/* Pass handlers to BookList */}
            <BookList
                books={books}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                error={error}
            />
        </div>
    );
}

export default BooksPage;
