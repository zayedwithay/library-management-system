import asyncHandler from 'express-async-handler';
import Member from '../models/Member.js';

// @desc    Register a new member
// @route   POST /api/members
// @access  Public or Private/Admin
const addMember = asyncHandler(async (req, res) => {
    const { name, memberId, email, membershipType } = req.body;

    // Validation
    if (!name || !memberId || !email || !membershipType) {
        res.status(400);
        throw new Error('Please provide name, memberId, email, and membership type');
    }

    const memberExists = await Member.findOne({ $or: [{ memberId }, { email }] });
    if (memberExists) {
        res.status(400);
        throw new Error('Member with this ID or Email already exists');
    }

    // Calculate expiry date based on membership type
    let expiryDate = new Date();
    switch (membershipType) {
        case '1 year':
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            break;
        case '2 years':
            expiryDate.setFullYear(expiryDate.getFullYear() + 2);
            break;
        case '6 months':
        default:
            expiryDate.setMonth(expiryDate.getMonth() + 6);
            break;
    }

    const member = await Member.create({
        name,
        memberId,
        email,
        membershipType,
        membershipExpiryDate: expiryDate,
        totalFinesDue: 0 // Initialize fines
    });

    if (member) {
        res.status(201).json({
            _id: member._id,
            name: member.name,
            memberId: member.memberId,
            email: member.email,
            membershipType: member.membershipType,
            membershipExpiryDate: member.membershipExpiryDate,
            totalFinesDue: member.totalFinesDue
            // Don't send password hash if implementing auth
        });
    } else {
        res.status(400);
        throw new Error('Invalid member data');
    }
});

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin
const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find({}); // Select fields if needed '-password'
  res.json(members);
});

// @desc    Get member by ID
// @route   GET /api/members/:id
// @access  Private/Admin or Member Self
const getMemberById = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id); //.select('-password');
    if(member){
        res.json(member);
    } else {
        res.status(404);
        throw new Error('Member not found');
    }
});

// @desc    Update member profile (e.g., extend membership)
// @route   PUT /api/members/:id
// @access  Private/Admin or Member Self
const updateMember = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    const { name, email, membershipType } = req.body;

    member.name = name || member.name;

    // Check if email is changing and if it's already taken
    if (email && email !== member.email) {
        const emailExists = await Member.findOne({ email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already in use');
        }
        member.email = email;
    }

    // Handle membership extension (example logic)
    if (membershipType) {
         // Based on spec: "extend their membership or cancel their membership By default - six months extension of membership selected."
         // This implies extending *from the current expiry* or a specific date.
         // The spec description is slightly ambiguous about *how* it's selected.
         // Assuming 'membershipType' passed in body means extend by that duration from *now* or from *expiry*
         let currentExpiry = member.membershipExpiryDate > new Date() ? member.membershipExpiryDate : new Date();

         switch (membershipType) {
            case 'cancel': // Specific keyword to cancel/expire
                 member.membershipExpiryDate = new Date(); // Expire now
                 member.membershipType = 'Cancelled'; // Or some status
                 break;
            case '1 year':
                 currentExpiry.setFullYear(currentExpiry.getFullYear() + 1);
                 member.membershipExpiryDate = currentExpiry;
                 member.membershipType = '1 year'; // Update type if needed
                 break;
             case '2 years':
                  currentExpiry.setFullYear(currentExpiry.getFullYear() + 2);
                  member.membershipExpiryDate = currentExpiry;
                  member.membershipType = '2 years'; // Update type if needed
                  break;
             case '6 months': // Default extension according to spec image
             default:
                  currentExpiry.setMonth(currentExpiry.getMonth() + 6);
                  member.membershipExpiryDate = currentExpiry;
                  member.membershipType = '6 months'; // Update type if needed
                  break;
         }
    }


    const updatedMember = await member.save();

    res.json({
         _id: updatedMember._id,
         name: updatedMember.name,
         memberId: updatedMember.memberId,
         email: updatedMember.email,
         membershipType: updatedMember.membershipType,
         membershipExpiryDate: updatedMember.membershipExpiryDate,
         totalFinesDue: updatedMember.totalFinesDue
    });
});


// @desc    Pay Fines for a member
// @route   POST /api/members/:id/payfine
// @access  Private/Admin
const payFine = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);
    if (!member) {
        res.status(404); throw new Error('Member not found');
    }

    const amountPaid = req.body.amountPaid || member.totalFinesDue; // Pay full amount if not specified

    if (amountPaid <= 0) {
        res.status(400); throw new Error('Payment amount must be positive');
    }
    if (amountPaid > member.totalFinesDue) {
         res.status(400); throw new Error(`Cannot pay more than the due amount of ${member.totalFinesDue}`);
    }

    member.totalFinesDue -= amountPaid;
    // TODO: Record this payment somewhere (e.g., a separate Payment collection or update related Transactions)

    const updatedMember = await member.save();
     res.json({
         message: `Fine paid successfully. Remaining balance: ${updatedMember.totalFinesDue}`,
         member: {
             _id: updatedMember._id,
             name: updatedMember.name,
             totalFinesDue: updatedMember.totalFinesDue
         }
     });
});


export { addMember, getMembers, getMemberById, updateMember, payFine };
