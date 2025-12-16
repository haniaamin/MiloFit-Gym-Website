const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const crypto = require("crypto");

// 🔹 Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );
};

const registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, nationalId } = req.body;

        // Check if the admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            nationalId,
            password: hashedPassword,
            role: "admin",
        });

        await newAdmin.save();

        const token = jwt.sign(
            { id: newAdmin._id, role: "admin" }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Admin registered successfully",
            token,
            admin: { id: newAdmin._id, firstName, lastName, email, role: "admin" },
        });

    } catch (error) {
        console.error("Admin Registration Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, nationalId, password, role } = req.body;

        console.log("Incoming registration data:", req.body); // 🔍 Debug

        if (!role || !["trainee", "trainer"].includes(role)) {
            return res.status(400).json({ message: "Invalid or missing role selected." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            nationalId,
            password: hashedPassword,
            role,
            status: role === "trainer" ? "pending" : "approved",
        });

        await newUser.save();

        let redirectUrl = role === "trainee" ? "/trainee-complete-profile" : "/trainer-complete-profile";

        res.status(201).json({ message: "User registered successfully", role, redirectUrl });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const approveTrainer = async (req, res) => {
    try {
        const { trainerId } = req.body;

        const trainer = await User.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        if (trainer.role !== "trainer") {
            return res.status(400).json({ message: "User is not a trainer" });
        }

        trainer.status = "approved";
        await trainer.save();

        res.status(200).json({ message: "Trainer approved successfully" });

    } catch (error) {
        console.error("Trainer Approval Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (user.role === "trainer" && user.status !== "approved") {
            return res.status(403).json({ message: "Your account is pending approval by the admin." });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);

        res.status(200).json({
            token,
            user: { 
                id: user._id, 
                name: `${user.firstName}`,  
                email: user.email, 
                role: user.role 
            }
        });
        
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`✅ OTP for ${email}: ${otp}`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"MiloFit Gym Support" <support@milofit.com>`,
            to: email,
            subject: "MiloFit Gym - Secure OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Your OTP Code: <strong>${otp}</strong></h2>
                    <p>Please use this code to reset your password. It expires in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <br>
                    <p>Thanks, <br> MiloFit Gym Team</p>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Error sending email:", error);
                return res.status(500).json({ message: "Email sending failed", error });
            }
            console.log("📩 Email sent:", info.response);
            res.status(200).json({ message: "OTP sent to email" });
        });

    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.resetOtp || !user.otpExpires) {
            return res.status(400).json({ message: "OTP not requested" });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (Date.now() > new Date(user.otpExpires).getTime()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("❌ OTP Verification Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getProfile = async (req, res) => {
    try {
        console.log("User Profile Data:", req.user);
        res.status(200).json(req.user);
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            user.password = bcrypt.hashSync(password, 10);
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = {
    registerAdmin,
    registerUser,
    approveTrainer,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
};
