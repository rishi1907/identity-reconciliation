import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import identityRoutes from './routes/identityRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/', identityRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`backend is running on port ${PORT}`);
    });
};

startServer();
