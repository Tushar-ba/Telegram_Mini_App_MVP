const express = require('express');
require('dotenv').config();
const app = express();
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

