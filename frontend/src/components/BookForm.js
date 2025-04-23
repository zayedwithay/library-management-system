import React, { useState, useEffect } from 'react';
import './Form.css'; // Create generic form CSS

// Pass book data for editing, and onSubmit handler
function BookForm({ onSubmit, initialData = null, isUpdating = false }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [totalCopies, setTotalCopies] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setAuthor(initialData.author || '');
            setIsbn(initialData.isbn || '');
            setTotalCopies(initialData.totalCopies !== undefined ? initialData.totalCopies : 1);
        } else {
             // Reset form if initialData becomes null (e.g., navigating away and back)
            setTitle('');
            setAuthor('');
            setIsbn('');
            setTotalCopies(1);
        }
        // Clear messages when initial data changes or form type changes
        setError('');
        setSuccess('');
    }, [initialData, isUpdating]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!title || !author || !isbn || totalCopies < 0) {
            setError('Please fill in all fields correctly (Title, Author, ISBN, Total Copies >= 0).');
            setLoading(false);
            return;
        }

        try {
            await onSubmit({ title, author, isbn, totalCopies });
            setSuccess(`Book ${isUpdating ? 'updated' : 'added'} successfully!`);
            // Optionally clear form after successful add
            if (!isUpdating) {
                 setTitle('');
                 setAuthor('');
                 setIsbn('');
                 setTotalCopies(1);
            }
        } catch (err) {
             // Display backend error message if available
            setError(err.message || `Failed to ${isUpdating ? 'update' : 'add'} book.`);
        } finally {
             setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>{isUpdating ? 'Update Book' : 'Add New Book'}</h2>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="author">Author:</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="isbn">ISBN:</label>
                <input
                    type="text"
                    id="isbn"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    required
                    // Readonly if updating? Depends on requirements
                    // readOnly={isUpdating}
                    disabled={loading}
                />
                 {/* {isUpdating && <small>ISBN cannot be changed after creation.</small>} */}
            </div>
             <div className="form-group">
                <label htmlFor="totalCopies">Total Copies:</label>
                <input
                    type="number"
                    id="totalCopies"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(parseInt(e.target.value, 10) || 0)}
                    required
                    min="0"
                    disabled={loading}
                />
            </div>
            <button type="submit" className="form-button" disabled={loading}>
                {loading ? 'Saving...' : (isUpdating ? 'Update Book' : 'Add Book')}
            </button>
        </form>
    );
}

export default BookForm;
