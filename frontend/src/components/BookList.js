import React from 'react';
import './List.css'; // Create generic list CSS

function BookList({ books = [], onEdit, onDelete, loading, error }) {

    if (loading) {
        return <p>Loading books...</p>;
    }

    if (error) {
        return <p className="list-error">Error loading books: {error}</p>;
    }

     if (books.length === 0) {
        return <p>No books found.</p>;
    }

    return (
        <div className="list-container">
            <h2>Book List</h2>
            <table className="list-table">
                 <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Total Copies</th>
                        <th>Available</th>
                         <th>Actions</th>
                    </tr>
                </thead>
                 <tbody>
                    {books.map(book => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                             <td>{book.isbn}</td>
                            <td>{book.totalCopies}</td>
                            <td>{book.availableCopies}</td>
                             <td>
                                 {/* Add buttons/links for Edit, Delete, View Details etc. */}
                                 {/* <button onClick={() => onEdit(book)} className="list-button-edit">Edit</button> */}
                                 {/* <button onClick={() => onDelete(book._id)} className="list-button-delete">Delete</button> */}
                                 <span style={{ marginRight: '10px' }}>Edit</span>
                                 <span>Delete</span>
                             </td>
                        </tr>
                    ))}
                 </tbody>
            </table>
        </div>
    );
}

export default BookList;
