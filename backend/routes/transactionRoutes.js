import express from 'express';
import {
    issueBook,
    returnBook,
    getTransactions
} from '../controllers/transactionController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Assuming these are admin/librarian actions
router.post('/issue', issueBook); // protect, admin
router.post('/return', returnBook); // protect, admin
router.get('/', getTransactions); // protect, admin

export default router;
