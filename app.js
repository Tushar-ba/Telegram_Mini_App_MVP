const express = require('express');
require('dotenv').config();
const app = express();
const connectDB = require('./config/database');
const GoldCoinUpdateJob = require('./job/updateBalanceCron');
const goldCoinJob = new GoldCoinUpdateJob();
const starPurchaseRoutes = require('./routes/starPurchase');
// Connect to MongoDB
connectDB();

//job
goldCoinJob.start();

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userDataRoutes = require('./routes/userdata');
const dailyRewardsRoutes = require('./routes/dailyRewards');
const membershipRoutes = require('./routes/membership');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/userdata', userDataRoutes);
app.use('/api/starPurchase', starPurchaseRoutes);
app.use('/api/dailyRewards', dailyRewardsRoutes);
app.use('/api/membership', membershipRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

