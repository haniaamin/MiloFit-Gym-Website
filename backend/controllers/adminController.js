const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Booking = require('../models/Booking');
const TrainerUtilization = require('../models/TrainerUtilization'); // Assuming we track trainer activity
const TrainerProfile = require('../models/TrainerProfile'); // Import TrainerProfile model
const TraineeProfile = require('../models/TraineeProfile');
const TrainerSessions = require('../models/TrainerSessions'); // Import your Session model
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const { search, role, status, sort } = req.query;

    let filter = {}; // Empty filter means get all users

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Sorting
    let sortOption = {};
    if (sort === "A-Z") {
      sortOption.firstName = 1; // ascending
    } else if (sort === "Z-A") {
      sortOption.firstName = -1; // descending
    }

    // Find users with filter and sorting, exclude passwords
    const users = await User.find(filter)
      .select("-password")
      .sort(sortOption)
      .lean(); // lean for faster reads & to allow adding fields

    // For trainers, fetch TrainerProfile to get gender and merge it
    const usersWithGender = await Promise.all(
      users.map(async (user) => {
        if (user.role === "trainer") {
          const profile = await TrainerProfile.findOne({ email: user.email }).lean();
          return {
            ...user,
            gender: profile ? profile.gender : null,
          };
        }
        return user;
      })
    );

    res.status(200).json(usersWithGender);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get a single user's profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Update user profile (Admin only)
const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role; // Admin can change roles

        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log("Delete request received for user ID:", req.params.id);

        const user = await User.findOneAndDelete({ _id: req.params.id });

        if (!user) {
            console.log("User not found:", req.params.id);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User deleted, checking for associated profiles...");

        const TraineeProfile = require("../models/TraineeProfile"); // Import
        const TrainerProfile = require("../models/TrainerProfile"); // Import

        if (user.role === "trainee") {
            await TraineeProfile.deleteOne({ email: user.email }); // Delete trainee profile by email
            console.log(`TraineeProfile deleted for email: ${user.email}`);
        } else if (user.role === "trainer") {
            await TrainerProfile.deleteOne({ email: user.email }); // Delete trainer profile by email
            console.log(`TrainerProfile deleted for email: ${user.email}`);
        }

        res.status(200).json({ message: "User and associated profile deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};








// **Approve or Reject Trainer**
const approveTrainer = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 1️⃣ Find the trainer in the `users` collection
        const trainer = await User.findById(id);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        if (trainer.role !== "trainer") {
            return res.status(400).json({ message: "User is not a trainer" });
        }

        // 2️⃣ If admin rejects the trainer, remove them from `users`
        if (status === "rejected") {
            await User.findByIdAndDelete(id); // Remove from users collection
            await TrainerProfile.deleteOne({ email: trainer.email }); // Remove from trainerprofiles if exists
            return res.status(200).json({ message: "Trainer rejected and removed." });
        }

        // 3️⃣ If approved, update status & create profile if not exists
        if (status === "approved") {
            trainer.status = "approved";
            trainer.isActive = true; // 🔹 Make trainer Active in UI
            await trainer.save();

            // 4️⃣ Create trainer profile in `trainerprofiles` only if it doesn't exist
            const existingProfile = await TrainerProfile.findOne({ email: trainer.email });

            if (!existingProfile) {
                const trainerProfile = new TrainerProfile({
                    email: trainer.email,
                    gender: trainer.gender || "Not specified",
                    dateOfBirth: trainer.dateOfBirth || { month: "1", date: "1", year: "2000" },
                    weight: trainer.weight || 0,
                    height: trainer.height || 0,
                    expertise: trainer.expertise || "General",
                    experience: trainer.experience || "Not specified",
                    certifications: trainer.certifications || "",
                    profilePicture: trainer.profilePicture || "",
                });

                await trainerProfile.save(); // Save in trainerprofiles collection
                return res.status(200).json({ message: "Trainer approved and profile created." });
            } else {
                return res.status(200).json({ message: "Trainer approved. Profile already exists." });
            }
        }

        return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });

    } catch (error) {
        console.error("❌ Error approving/rejecting trainer:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




const subscribeUser = async (req, res) => {
  try {
    const { userId,packageName, price, method, startDate  } = req.body;

    const validUntil = new Date(startDate);
    validUntil.setMonth(validUntil.getMonth() + 1); // Valid for 1 month

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'trainee') return res.status(400).json({ message: 'Only trainees can subscribe' });

    // Create or update subscription
    let subscription = await Subscription.findOne({ userId });
    if (subscription) {
      subscription.price = price;
      subscription.packageName = packageName;
      subscription.method = method;
      subscription.startDate = startDate;
      subscription.validUntil = validUntil;
      subscription.active = true;
    } else {
      subscription = new Subscription({ userId,packageName, price, method, startDate, validUntil, active: true });
    }
    await subscription.save();

    // Activate user
    user.isActive = true;
    await user.save();

    res.status(200).json({ message: 'User subscribed and activated successfully' });
  } catch (error) {
    console.error('Subscribe user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMySubscription = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT

    const sub = await Subscription.findOne({ userId }).sort({ startDate: -1 });

    if (!sub) return res.status(404).json({ message: 'No subscription found' });

    res.status(200).json({
      packageName: sub.packageName,
      validUntil: sub.validUntil,
    });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



const updateUserActiveStatus = async (req, res) => {
  try {
    const { isActive } = req.body; // Expecting true or false

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update active status
    user.isActive = isActive;

    // Handle trainer-specific deactivation
    if (user.role === 'trainer' && !isActive && user.status === 'approved') {
      user.status = 'pending';
      await TrainerProfile.findOneAndDelete({ userId: user._id });
    }

    // Handle trainee-specific deactivation
    if (user.role === 'trainee' && !isActive) {
      // Delete subscription on deactivation
      await Subscription.deleteOne({ userId: user._id });
    }

    await user.save();

    res.status(200).json({
      message: `User is now ${isActive ? 'active' : 'inactive'}`,
      updatedStatus: user.status
    });
  } catch (error) {
    console.error("Error updating user active status:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Define start of current month and start of next month
    const monthStart = new Date(currentYear, currentMonth, 1);
    const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);

    // Monthly revenue - sum of active subscription payments starting this month
    const monthlyRevenueAgg = await Subscription.aggregate([
      {
        $match: {
          active: true,
          startDate: { $gte: monthStart, $lt: nextMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const monthlyRevenue = monthlyRevenueAgg.length > 0 ? monthlyRevenueAgg[0].total : 0;

    // Active subscriptions count
    const activeSubscriptions = await Subscription.countDocuments({ active: true });

    // Renewal Due (subscriptions expiring in the next 7 days)
    const nowDate = new Date();
    const sevenDaysFromNow = new Date(nowDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const renewalDue = await Subscription.countDocuments({
      renewalDate: { $gte: nowDate, $lte: sevenDaysFromNow },
      active: true,
    });

    // New Signups This Month (users created in the current month)
    const newSignups = await User.countDocuments({
      createdAt: { $gte: monthStart, $lt: nextMonthStart },
    });

    // Total revenue (all time active subscriptions)
    const totalRevenueAgg = await Subscription.aggregate([
      { $match: { active: true } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    // Classes Booked (total bookings this month)
   const classesBooked = await TrainerSessions.countDocuments();

    // Utilization % (average utilization for active trainers)
    const trainers = await User.find({ role: "trainer", isActive: true });
    let utilization = 0;
    if (trainers.length > 0) {
      const totalUtil = await TrainerUtilization.aggregate([
        { $match: { trainerId: { $in: trainers.map(t => t._id) } } },
        { $group: { _id: null, avgUtil: { $avg: "$utilization" } } },
      ]);
      utilization = totalUtil.length > 0 ? totalUtil[0].avgUtil : 0;
    }

    res.status(200).json({
      monthlyRevenue,
      activeSubscriptions,
      renewalDue,
      newSignups,
      totalRevenue,
      classesBooked,
      utilization,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ active: true }).populate('userId', 'email phone');
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// New controller function
const getUserRoleCounts = async (req, res) => {
  try {
    const traineeCount = await User.countDocuments({ role: 'trainee' });
    const trainerCount = await User.countDocuments({ role: 'trainer' });

    res.json({ trainee: traineeCount, trainer: trainerCount });
  } catch (error) {
    console.error('Error fetching user role counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Helper to convert month index to short name

const getMonthlyRevenue = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const monthlyData = await Payment.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          revenue: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          monthIndex: "$_id",
          revenue: 1
        }
      }
    ]);

    // Convert to format: [{ month: 'Jan', revenue: 10000 }, ...]
    const result = Array.from({ length: 12 }, (_, i) => {
      const found = monthlyData.find(m => m.monthIndex === i + 1);
      return {
        month: monthNames[i],
        revenue: found ? found.revenue : 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMonthlyRevenue:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { 
    getAllUsers, 
    getUserProfile, 
    updateUser, 
    deleteUser, 
    approveTrainer, 
    subscribeUser,
    updateUserActiveStatus,
    getDashboardStats,
    getUserCount,
    getAllSubscriptions,
    getUserSubscription,
    getMySubscription,
    getUserRoleCounts,
    getMonthlyRevenue
};

