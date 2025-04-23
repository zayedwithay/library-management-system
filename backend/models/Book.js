import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'Please add an ISBN'],
      unique: true, // ISBN should be unique
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Please add the total number of copies'],
      min: [0, 'Total copies cannot be negative'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'Available copies cannot be negative'],
      // This should ideally be updated via transactions, not directly
      // We'll initialize it based on totalCopies
      default: function () {
        return this.totalCopies;
      },
      validate: [
         function(value) { return value <= this.totalCopies },
         'Available copies cannot exceed total copies'
      ]
    },
    // Add other fields as needed, e.g., publisher, year, genre
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;
