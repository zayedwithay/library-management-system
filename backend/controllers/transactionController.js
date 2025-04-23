import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import mongoose from 'mongoose';

// Function to calculate due date (e.g., 15 days from issue)
const calculateDueDate = (issueDate = new Date()) => {
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 15); // Add 15 days
    return dueDate;
};

// Function to calculate fine (Example:  per day overdue)
const calculateFine = (dueDate, returnDate) => {
    if (!returnDate || returnDate <= dueDate) {
        return 0; // No fine if returned on time or before due date
    }
    const diffTime = Math.abs(returnDate - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const finePerDay = 1; // Example fine rate
    return diffDays * finePerDay;
};

// @desc    Issue a book to a member
// @route   POST /api/transactions/issue
// @access  Private/Admin
const issueBook = asyncHandler(async (req, res) => {
    const { bookId, memberId, issueDate, dueDate } = req.body;

    // --- Validation ---
    if (!bookId || !memberId) {
        res.status(400); throw new Error('Book ID and Member ID are required');
    }
    if (!mongoose.Types.ObjectId.isValid(bookId) || !mongoose.Types.ObjectId.isValid(memberId)) {
         res.status(400); throw new Error('Invalid Book or Member ID format');
    }

    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book) { res.status(404); throw new Error('Book not found'); }
    if (!member) { res.status(404); throw new Error('Member not found'); }

    // Check member status (e.g., membership expiry, existing fines)
    if (member.membershipExpiryDate < new Date()) {
        res.status(400); throw new Error('Member membership has expired');
    }
    // Add check for maximum borrow limit if needed

    // Check book availability
    if (book.availableCopies <= 0) {
        res.status(400); throw new Error('Book is not currently available');
    }

    // Check if member already has this *specific book title* issued and not returned (more complex query needed)
    // Simple check: Prevent issuing if *any* copy is currently issued to this member
    const existingTransaction = await Transaction.findOne({
        book: bookId,
        member: memberId,
        returnDate: null // Check for transactions that haven't been returned
    });
    if (existingTransaction) {
        res.status(400); throw new Error('Member already has this book issued');
    }

    // --- Process Issue ---
    const actualIssueDate = issueDate ? new Date(issueDate) : new Date(); // Use provided or default to now
    let actualDueDate = dueDate ? new Date(dueDate) : calculateDueDate(actualIssueDate);

    // Validation from spec: Due date must be >= issue date + 15 days (but can be later)
    const minDueDate = calculateDueDate(actualIssueDate);
    if (actualDueDate < minDueDate) {
       // Specification: Can be edited to a date earlier than that, But not greater than 15 days. - This seems contradictory.
       // Let's assume it means: Default is +15 days. Can be manually set, but must be AT LEAST 15 days after issue.
       // Re-interpreting spec: "Automatically populated with a date 15 days ahead. It can be edited to a date *later* than that. But not *earlier* than 15 days." - This makes more sense?
       // Let's stick to the *literal* interpretation first: Cannot be > 15 days ahead. Can be earlier.
       // Let's refine based on the image: "Issue Date - cannot be future date", "Due Date - Automatically populated with a date 15 days ahead. It can be edited to a date earlier than that, But not greater than 15 days."
       // This implies the *maximum* due date is 15 days ahead? Seems unusual for a library.
       // *Assumption*: Let's assume the spec meant it *defaults* to +15 days, but can be manually overridden (maybe within limits like +30 max?). For now, let's enforce the weird rule: Cannot be > 15 days ahead.

        const maxDueDate = new Date(actualIssueDate);
        maxDueDate.setDate(maxDueDate.getDate() + 15);
        if (actualDueDate > maxDueDate) {
             res.status(400);
             throw new Error('Due date cannot be more than 15 days after the issue date.');
        }
         // Let's allow setting it earlier than +15, but not before the issue date itself.
        if (actualDueDate < actualIssueDate) {
            res.status(400);
            throw new Error('Due date cannot be before the issue date.');
        }
       // If validation passes, use the user-provided actualDueDate
    } else {
        // If no dueDate provided, use the calculated default
        actualDueDate = calculateDueDate(actualIssueDate);
    }


    // Create transaction record
    const transaction = new Transaction({
        book: bookId,
        member: memberId,
        issueDate: actualIssueDate,
        dueDate: actualDueDate,
        transactionType: 'issue'
    });

    // Update book's available copies (decrement)
    book.availableCopies -= 1;

    // Use a session for atomicity (optional but recommended for production)
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const savedTransaction = await transaction.save({ session });
        await book.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(savedTransaction);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500); // Internal server error during transaction
        throw new Error(`Failed to issue book: ${error.message}`);
    }
});

// @desc    Return a book
// @route   POST /api/transactions/return
// @access  Private/Admin
const returnBook = asyncHandler(async (req, res) => {
    const { transactionId, returnDate, payFineNow } = req.body; // Need ID of the *issue* transaction

    // --- Validation ---
    if (!transactionId) {
        res.status(400); throw new Error('Transaction ID is required to return a book');
    }
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        res.status(400); throw new Error('Invalid Transaction ID format');
    }

    const transaction = await Transaction.findById(transactionId).populate('book').populate('member');

    if (!transaction) { res.status(404); throw new Error('Issue transaction not found'); }
    if (transaction.returnDate) { res.status(400); throw new Error('This book has already been returned'); }
    if (!transaction.book || !transaction.member) {
         res.status(500); throw new Error('Transaction is missing book or member data.'); // Data integrity issue
    }

    // --- Process Return ---
    const actualReturnDate = returnDate ? new Date(returnDate) : new Date();

    // Validation from spec: Return date auto-populates today, can be edited to earlier date, but not later than today.
    if (actualReturnDate > new Date()) {
        res.status(400); throw new Error('Return date cannot be in the future.');
    }
    // Must also be after or on the issue date
    if (actualReturnDate < transaction.issueDate) {
        res.status(400); throw new Error('Return date cannot be before the issue date.');
    }

    transaction.returnDate = actualReturnDate;
    transaction.transactionType = 'return'; // Update type or keep original? Let's mark it returned.

    // Calculate fine
    const fine = calculateFine(transaction.dueDate, transaction.returnDate);
    transaction.fineAmount = fine;

    // Update book's available copies (increment)
    const book = await Book.findById(transaction.book._id); // Re-fetch book for safety
    if (!book) { res.status(500); throw new Error('Book data associated with transaction not found.'); }
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1); // Increment, but not beyond total

    // Update member's total fine due ONLY if fine is not paid now
    const member = await Member.findById(transaction.member._id);
     if (!member) { res.status(500); throw new Error('Member data associated with transaction not found.'); }


    // Use a session for atomicity
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (fine > 0) {
             // Spec: "If there is calculated fine, then the user can press confirm and the transaction will be successfully completed."
             // "For a pending fine, the paid fine check box needs to be selected before the user can complete the return book transaction." - This is confusing.
             // Interpretation 1: Fine exists -> MUST check 'payFineNow' -> update member fine = 0.
             // Interpretation 2: Fine exists -> Can return WITHOUT checking box -> member fine increases. If box checked -> member fine maybe doesn't increase (or is cleared immediately).
             // Interpretation 3 (Based on image flow): Fine calculated & shown. 'Pay Fine' checkbox appears ONLY if fine > 0. If checked, fine is paid. If not checked (or doesn't appear), fine is added to member total. Book return happens regardless.

             // Let's go with Interpretation 3
             if (payFineNow) {
                 transaction.finePaid = true;
                 // Don't add this specific fine to the member's total (or potentially deduct if already added elsewhere?)
                 // For simplicity here: if paid now, it doesn't add to member's running total.
             } else {
                 transaction.finePaid = false;
                 member.totalFinesDue += fine; // Add this transaction's fine to the member's total
             }
         } else {
            transaction.finePaid = true; // No fine, so technically "paid"
         }

        const savedTransaction = await transaction.save({ session });
        await book.save({ session });
        if (fine > 0 && !payFineNow) { // Only save member if fine added
             await member.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: `Book returned ${fine > 0 && !payFineNow ? 'with a fine of $' + fine + ' added to member account.' : (fine > 0 && payFineNow ? 'with a fine of $' + fine + ' paid.' : 'successfully.')}`,
            transaction: savedTransaction
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500);
        throw new Error(`Failed to return book: ${error.message}`);
    }
});

// @desc    Get all transactions (e.g., borrowing history)
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = asyncHandler(async (req, res) => {
    // Add filtering by member, book, date range etc.
    const transactions = await Transaction.find({})
        .populate('book', 'title isbn') // Populate book title/isbn
        .populate('member', 'name memberId') // Populate member name/id
        .sort({ createdAt: -1 }); // Sort by most recent first
    res.json(transactions);
});


export { issueBook, returnBook, getTransactions };
