// Placeholder for authentication middleware (e.g., JWT verification)
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
// Import User model when created

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (assuming user ID is stored in 'id')
      // req.user = await User.findById(decoded.id).select('-password'); // Attach user to request

      if (!req.user) {
         res.status(401);
         throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Placeholder for admin middleware
const admin = (req, res, next) => {
  // if (req.user && req.user.isAdmin) { // Check if user is logged in and is an admin
  //   next();
  // } else {
  //   res.status(401);
  //   throw new Error('Not authorized as an admin');
  // }
   console.warn("Admin middleware placeholder: Allowing access.");
   next(); // Temporary: allow access until admin logic implemented
};


export { protect, admin };
