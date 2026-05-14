require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const http = require("http");
const { Server } = require("socket.io");

const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

// =========================
// FRONTEND URLS
// =========================
const allowedOrigins = [
  "http://localhost:3000",
  "https://milo-fit-gym-website-git-main-haniamohamed2002-1416s-projects.vercel.app",
];

// =========================
// STRIPE
// =========================
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(bodyParser.json());

// =========================
// MONGODB CONNECTION
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// =========================
// DEFAULT ROUTE
// =========================
app.get("/", (_req, res) => {
  res.send("MiloFit Gym Backend is Running 🚀");
});

// =========================
// STRIPE PAYMENT ROUTE
// =========================
app.post("/create-payment-intent", async (req, res) => {
  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.send({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// =========================
// ROUTES
// =========================
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const traineeRoutes = require("./routes/traineeRoutes");
app.use("/api/trainee", traineeRoutes);

const trainerRoutes = require("./routes/trainerRoutes");
app.use("/api/trainer", trainerRoutes);

const traineesessionsRoutes = require("./routes/traineesessionsRoutes");
app.use("/api", traineesessionsRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use(profileRoutes);

const notificationsRoutes = require("./routes/notificationsRoutes");
app.use("/api/notifications", notificationsRoutes);

const classBookingRoutes = require("./routes/classBookingRoutes");
app.use("/api/class-bookings", classBookingRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

const subscriptionRoutes = require("./routes/subscriptionRoutes");
app.use("/api/subscriptions", subscriptionRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

const chatsRoutes = require("./routes/chatsRoutes");
app.use("/api/chats", chatsRoutes);

const sessionRoutes = require("./routes/SessionRoutes");
app.use("/api/sessions", sessionRoutes);

const packageRoutes = require("./routes/PackageRoutes");
app.use("/api/packages", packageRoutes);

// =========================
// STATIC FILES
// =========================
app.use("/uploads", express.static("uploads"));

// =========================
// SOCKET.IO
// =========================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(
      `Socket ${socket.id} joined conversation ${conversationId}`
    );
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

      socket.to(messageData.conversationId).emit("receive_message", {
        _id: message._id,
        sender: messageData.sender,
        text: messageData.text,
        time: message.time.toISOString(),
      });
    } catch (err) {
      console.error("❌ Failed to save/send message:", err);
    }
  });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
    console.log(
      `Socket ${socket.id} left conversation ${conversationId}`
    );
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});