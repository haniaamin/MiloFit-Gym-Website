const express = require("express");
const {
    registerAdmin,
    registerUser,
    approveTrainer,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser,
    forgotPassword,
    verifyOtp,
    resetPassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin Registration Route
router.post("/admin/register", registerAdmin);

/** =======================
 * ✅ Public Routes (Anyone can access)
 * ======================== */
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route to approve a trainer
router.put("/approve-trainer", approveTrainer);

// Forgot Password - Request reset link
router.post("/forgot-password", forgotPassword);

// Route for verifying email code
router.post("/verify-otp", verifyOtp);

// Reset Password - Update new password
router.post("/reset-password", resetPassword);

/** =======================
 * ✅ Protected Routes (User must be logged in)
 * ======================== */
router.post("/logout", authMiddleware, logoutUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile); // Optional: Add roleMiddleware('trainee')

/** =======================
 * ✅ Role-Specific Routes
 * ======================== */
router.get("/admin-dashboard", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

router.get("/trainer-dashboard", authMiddleware, roleMiddleware("trainer"), (req, res) => {
    res.json({ message: "Welcome, Trainer!" });
});

router.get("/trainee-dashboard", authMiddleware, roleMiddleware("trainee"), (req, res) => {
    res.json({ message: "Welcome, Trainee!" });
});


module.exports = router;