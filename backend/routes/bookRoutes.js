import express from 'express';
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  checkAvailability
} from '../controllers/bookController.js';
// Add protect/admin middleware later
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBooks) // Public or protect
  .post(addBook); // protect, admin

router.route('/:id')
  .get(getBookById) // Public or protect
  .put(updateBook) // protect, admin
  .delete(deleteBook); // protect, admin

router.get('/availability/:id', checkAvailability); // Public or protect

export default router;
