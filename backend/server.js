import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import flockRoutes from './routes/flockRoutes.js'
import vaccinationRoutes from './routes/vaccinationRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import activityRoutes from './routes/activityRoutes.js'
import connectDB from './config/db.js';

// dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flocks', flockRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);


// Server listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
