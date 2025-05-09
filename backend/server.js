import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
// import aiRoutes from './routes/aiRoutes.js'
// import vaccinationRoutes from './routes/vaccinationRoutes.js'
// import pedigreeRoutes from './routes/pedigreeRoutes.js'
// import communityRoutes from './routes/communityRoutes.js'
import connectDB from './config/db.js';

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/vaccination', vaccinationRoutes);
// app.use('/api/community', communityRoutes);
// app.use('/api/pedigree', pedigreeRoutes);


// Server listen
// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
module.exports = app;