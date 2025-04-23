import mongoose from 'mongoose';

const memberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a member name'],
      trim: true,
    },
    memberId: {
      type: String,
      required: [true, 'Please add a unique member ID'],
      unique: true,
      trim: true,
      // Consider generating this automatically or having a specific format
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    membershipType: {
        type: String,
        enum: ['6 months', '1 year', '2 years'],
        default: '6 months'
    },
    membershipExpiryDate: {
        type: Date,
        // Logic to set this based on registration date and membershipType needed in controller
    },
    totalFinesDue: {
        type: Number,
        default: 0,
        min: 0
    }
    // Add password hash if implementing member login
    // password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model('Member', memberSchema);

export default Member;
