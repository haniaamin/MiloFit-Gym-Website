require("dotenv").config();
const express = require("express");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Default Route
app.get("/", (_req, res) => {
  res.send("MiloFit Gym Backend is Running 🚀");
});

// Stripe Payment Route
app.post("/create-payment-intent", async (req, res) => {
  const { paymentMethodId, amount } = req.body;

  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (e.g., $15.00 = 1500)
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true, // Automatically confirm the payment
    });

    res.send({ success: true, paymentIntent });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const traineeRoutes = require("./routes/traineeRoutes");
app.use("/api/trainee", traineeRoutes);

const trainerRoutes = require("./routes/trainerRoutes");
app.use("/api/trainer", trainerRoutes);

const traineesessionsRoutes = require('./routes/traineesessionsRoutes');
app.use('/api', traineesessionsRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use(profileRoutes);

const notificationsRoutes = require("./routes/notificationsRoutes");
app.use("/api/notifications",notificationsRoutes);

const classBookingRoutes = require('./routes/classBookingRoutes');
app.use('/api/class-bookings', classBookingRoutes);

// Serve static images
app.use("/uploads", express.static("uploads"));

// Feedback Routes
const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/api/subscriptions', subscriptionRoutes);

// Chat Routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);
console.log("✅ Chatbot routes are loaded at /api/chat");

const chatsRoutes = require("./routes/chatsRoutes");
app.use("/api/chats", chatsRoutes);

// Session Routes (for Save/Edit/Cancel)
const sessionRoutes = require('./routes/SessionRoutes');
app.use('/api/sessions', sessionRoutes);

// add packages by trainer
const packageRoutes = require('./routes/PackageRoutes');
app.use('/api/packages', packageRoutes);

// HTTP & Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on("send_message", async (messageData) => {
    try {
      const message = new Message({
        conversationId: messageData.conversationId,
        sender: messageData.sender,
        text: messageData.text,
        time: new Date(),
      });
      await message.save();

      // Emit message to all clients in the room EXCEPT the sender
      socket.to(messageData.conversationId).emit("receive_message", {
        _id: message._id,
        sender: messageData.sender,
        text: messageData.text,
        time: message.time.toISOString(),
      });
    } catch (err) {
      console.error("Failed to save/send message:", err);
    }
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
