const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        nationalId: { type: String, required: false },
        password: { type: String, required: true },
        resetOtp: { type: String }, // Ensure OTP is saved
        otpExpires: { type: Date }, // Ensure expiration is stored
        role: { 
            type: String, 
            enum: ['admin', 'trainer', 'trainee'], 
            default: 'trainee' 
        },
        status: { 
            type: String, enum: ["pending", "approved", "rejected"], default: "pending"
            },
        isActive: { 
            type: Boolean, 
            default: false // ✅ Default: User is inactive until they log in
        }
        
    },
    { timestamps: true }
);
// 🔹 Ensure admin status is always "approved" and isActive is true
userSchema.pre('save', function (next) {
    if (this.role === 'admin') {
        this.status = 'approved';
        this.isActive = true;
    }
    next();
});

// 🔹 Ensure updates also enforce the rule
userSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.role === 'admin') {
        update.status = 'approved';
        update.isActive = true;
    }
    next();
});
module.exports = mongoose.model('User', userSchema);
