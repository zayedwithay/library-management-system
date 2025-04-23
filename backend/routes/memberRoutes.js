import express from 'express';
import {
    addMember,
    getMembers,
    getMemberById,
    updateMember,
    payFine
} from '../controllers/memberController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(addMember) // Public or protect/admin
    .get(getMembers); // protect, admin

router.route('/:id')
    .get(getMemberById) // protect, admin or self
    .put(updateMember); // protect, admin or self

router.post('/:id/payfine', payFine); // protect, admin

export default router;
