const express = require('express');
const { 
    getAllUsers, 
    getUserProfile, 
    updateUser, 
    deleteUser, 
    approveTrainer, 
    subscribeUser ,
    updateUserActiveStatus, // ✅ Import new function
    getDashboardStats,
    getUserCount,
    getAllSubscriptions,
    getUserSubscription,
    getMySubscription,
    getUserRoleCounts,
    getMonthlyRevenue
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// ✅ User Management
router.get('/users' , getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserProfile);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);
// Route for approving a trainer
router.put("/users/:id/approve", approveTrainer); // Approve/Reject trainer
router.put('/users/:id/status', updateUserActiveStatus);
router.post('/subscriptions/subscribe', subscribeUser);
// adminRoutes.js
router.get('/subscription/subscribe', getAllSubscriptions);
router.get('/subscriptions/:userId', getUserSubscription);
router.get('/subscriptions/me', getMySubscription);
router.get('/user-role-counts', getUserRoleCounts);
router.get("/monthly-revenue", getMonthlyRevenue);


// ✅ Dashboard Stats
router.get('/dashboard-stats', getDashboardStats);
router.get('/user-count',  getUserCount);


module.exports = router;

