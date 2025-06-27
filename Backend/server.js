const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { setupGunRelay, testGunDB } = require('./gun/relay');

const driverRoutes = require('./routes/driverRoutes');
const carOwnerRoutes = require('./routes/carOwnerRoutes');
// const userRoutes = require('./routes/userRoutes');
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require("./routes/payment");

const app = express();
const httpServer = createServer(app);

// Enhanced Socket.IO configuration
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Initialize Gun relay
const gun = setupGunRelay(httpServer);

// Store instances on app
app.set('io', io);
app.set('gun', gun);

const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Test endpoint for GunDB
app.get('/api/test-gundb', async (req, res) => {
  try {
    const testResult = await testGunDB(gun);
    res.json({ 
      success: true, 
      message: 'GunDB is working!',
      data: testResult 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'GunDB test failed',
      error: error.message 
    });
  }
});

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

// Socket.IO connection handling with error handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Join a room based on user ID
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle live location updates
  socket.on('updateLocation', (data) => {
    try {
      const { userId, location } = data;
      
      // Store location in GunDB
      gun.get(`locations`).get(userId).put({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now()
      });

      // Emit to relevant subscribers
      socket.to(userId).emit('locationUpdate', {
        userId,
        location
      });
    } catch (error) {
      console.error('Error handling location update:', error);
      socket.emit('error', 'Failed to update location');
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });
});

// Error handling for the server
httpServer.on('error', (error) => {
  console.error('Server error:', error);
});

// Start Server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔫 GunDB relay available at http://localhost:${PORT}/gun`);
});
