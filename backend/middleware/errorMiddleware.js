const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass error to the next middleware
};

const errorHandler = (err, req, res, next) => {
  // Sometimes errors come with status codes, sometimes not. Default to 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose specific error handling
  // Bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404; // Treat as 'Not Found'
    message = 'Resource not found';
  }

  // Mongoose duplicate key (e.g., unique constraint)
   if (err.code === 11000) {
     statusCode = 400; // Bad Request
     const field = Object.keys(err.keyValue)[0];
     message = `Duplicate field value entered for '${field}'. Please use another value.`;
   }

   // Mongoose validation error
   if (err.name === 'ValidationError') {
     statusCode = 400;
     // Combine multiple validation error messages if they exist
     message = Object.values(err.errors).map(val => val.message).join(', ');
   }


  // Send the response
  res.status(statusCode).json({
    message: message,
    // Include stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
