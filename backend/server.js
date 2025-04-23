import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


// Import Routes
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import authRoutes from './routes/authRoutes.js';
// import authRoutes from './routes/authRoutes.js'; // Add when auth is implemented

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // Allow parsing URL-encoded bodies

// Basic Route
app.get('/', (req, res) => {
  res.send('Library Management API is running...');
});
// Login Route


app.use(cors());


app.use('/login', authRoutes);






// Mount Routers
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
// app.use('/api/auth', authRoutes); // Add when auth is implemented

// Error Handling Middleware (should be last)
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle other errors

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
