const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const driverRoutes = require('./routes/driverRoutes');
const carOwnerRoutes = require('./routes/carOwnerRoutes');
// const userRoutes = require('./routes/userRoutes');
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require("./routes/payment");


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = 5000;

app.use(cors());
app.use(express.json());

// Store io instance on app
app.set('io', io);

//  MongoDB Connection
mongoose.connect('mongodb+srv://vivekvivjnv1:VivekWinjitFinalPro@cluster0.svl6m7m.mongodb.net/transportApp?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

//  Routes
app.use('/api/driver', driverRoutes);
app.use('/api/carowner', carOwnerRoutes);
// app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/payment", paymentRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room based on user ID
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
