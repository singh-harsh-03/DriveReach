const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');

const driverRoutes = require('./routes/driverRoutes');
const carOwnerRoutes = require('./routes/carOwnerRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require("./routes/authRoutes");
const rideRequestRoutes = require("./routes/rideRequest");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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
app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ride-requests", rideRequestRoutes);


//  Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
