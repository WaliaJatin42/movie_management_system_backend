const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
const swaggerDocs = require('./swagger'); // Must exist at root
const { logHttpMiddleware } = require('./src/middlewares/logMiddleware');
// const logRoute = require(`./src/routes/logRoute`);
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = '/api/v1';

// Middleware setup
app.use(cors());
app.use(express.json()); // ✅ Ensure this comes before routes using req.body
app.use(logHttpMiddleware);

// DB Connection
connectDB();

// Routes
// app.use('/logs', logRoute); // ✅ Correct usage
app.use(`${API_VERSION}/auth`, authRoute);
app.use(`${API_VERSION}/users`, userRoute);

// Swagger Docs
swaggerDocs(app);

// Start server
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
