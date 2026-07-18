const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

// Fail fast if critical env vars are missing
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set — check your .env file');
}

connectDB();

const app = express();

// Security & core middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const menuRoutes = require('./src/routes/menuRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Eatery app API is running' });
});

// Centralized error handler — must be LAST, after all routes
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));