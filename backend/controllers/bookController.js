import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public (adjust as needed)
const getBooks = asyncHandler(async (req, res) => {
  // TODO: Add filtering, sorting, pagination (e.g., based on req.query)
  const books = await Book.find({});
  res.json(books);
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin (implement auth middleware later)
const addBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, totalCopies } = req.body;

  // Basic validation
  if (!title || !author || !isbn || totalCopies === undefined || totalCopies < 0) {
      res.status(400);
      throw new Error('Please provide title, author, ISBN, and a valid total number of copies');
  }

  // Check if book with ISBN already exists
  const bookExists = await Book.findOne({ isbn });
  if (bookExists) {
    res.status(400);
    throw new Error('Book with this ISBN already exists');
  }

  const book = new Book({
    title,
    author,
    isbn,
    totalCopies,
    availableCopies: totalCopies, // Initialize available copies
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, totalCopies, availableCopies } = req.body; // Be careful allowing direct availableCopies update

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    // Prevent changing ISBN easily, or validate uniqueness if changed
    if(isbn && isbn !== book.isbn) {
        const existingBook = await Book.findOne({isbn: isbn});
        if(existingBook && existingBook._id.toString() !== req.params.id) {
             res.status(400);
             throw new Error('Another book with this ISBN already exists.');
        }
        book.isbn = isbn;
    }
    // Handle copy updates carefully
    if (totalCopies !== undefined) {
        if (totalCopies < 0) {
            res.status(400);
            throw new Error('Total copies cannot be negative.');
        }
        // If total copies decreases, ensure available copies doesn't exceed it
        const diff = totalCopies - book.totalCopies;
        book.totalCopies = totalCopies;
        // Simple adjustment - real logic should consider issued books
        book.availableCopies = Math.max(0, Math.min(totalCopies, book.availableCopies + diff));
    }
    // Avoid direct manipulation of availableCopies here unless absolutely necessary
    // It should change based on issue/return transactions

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    // Add check: Ensure book is not currently issued before deleting?
    // Or mark as 'deleted' instead of removing?
    await book.deleteOne(); // Or use findByIdAndDelete(req.params.id)
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Check book availability (Simplified - just returns the book data)
// @route   GET /api/books/availability/:id
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id); // Or search by ISBN/Title

  if (book) {
    res.json({
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        availableCopies: book.availableCopies,
        isAvailable: book.availableCopies > 0
    });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});


export { getBooks, getBookById, addBook, updateBook, deleteBook, checkAvailability };
