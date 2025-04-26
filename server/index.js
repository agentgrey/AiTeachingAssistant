const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors());

// connecting to database
const connectDB = require('./db');
connectDB();

// routes
const route = require('./route');
app.use('/api', route);

app.get('/', (req, res) => {
  res.send('yo, its alive!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 server lit on http://localhost:${PORT}`));
