require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // For easier local development with Socket.IO
}));
app.use(morgan('dev'));

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (businessId) => {
    socket.join(businessId);
    console.log(`Socket ${socket.id} joined business room: ${businessId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Pass io to req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/webhook', require('./routes/webhookRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/business', require('./routes/businessRoutes'));
app.use('/api/broadcast', require('./routes/broadcastRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('WhatsApp Automation API is running...');
});

// Basic error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
