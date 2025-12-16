const mongoose = require("mongoose");

const trainerUtilizationSchema = new mongoose.Schema(
  {
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Track trainer
    month: Number,
    year: Number,
    utilizationRate: { type: Number, default: 0 }, // Percentage
  },
  { timestamps: true } // ✅ Ensures `createdAt` is available
);

module.exports = mongoose.model("TrainerUtilization", trainerUtilizationSchema);
