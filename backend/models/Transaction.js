import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book', // Reference to the Book model
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Member', // Reference to the Member model
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
      // Logic to set this (e.g., issueDate + 15 days) needed in controller
    },
    returnDate: {
      type: Date,
      // Set when the book is returned
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['issue', 'return'], // Could add 'fine_payment'
    },
    fineAmount: {
        type: Number,
        default: 0
    },
    finePaid: { // To track if fine related to this *return* was settled
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

// Ensure a member cannot borrow the same physical copy twice before returning
// Note: This simple index doesn't prevent borrowing *different* copies of the same title.
// More complex logic is needed for strict limits per title per member.
transactionSchema.index({ book: 1, member: 1, returnDate: 1 }, { unique: true, partialFilterExpression: { returnDate: null } });


const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
