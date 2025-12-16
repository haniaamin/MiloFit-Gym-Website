const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated first
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - Please log in" });
        }

        // Check if user has the required role
        if (!allowedRoles.includes(req.user.role)) {
            console.warn(
                `Access Denied: User with role "${req.user.role}" tried to access a restricted route. Allowed roles: ${allowedRoles.join(", ")}`
            );
            return res.status(403).json({ 
                message: `Access denied - Only ${allowedRoles.join(", ")} can access this route` 
            });
        }

        next(); // User has permission, proceed to next middleware
    };
};

module.exports = roleMiddleware;

