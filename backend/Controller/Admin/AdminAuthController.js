
const Admin = require('../../Models/Admin');
const bcrypt = require('bcrypt');

// Import at the top of the file
const { generateToken } = require('../../utlis/jwtHelpers');

// 🔥 Login Admin
exports.login = async (req, res) => {
    const adminID = req.body.adminID || req.body.AdminID;
    const password = req.body.password || req.body.Password;

    // 🛑 Validation
    if (!adminID || !password) {
        return res.status(400).json({
            message: "Admin ID and password are required",
            received: { adminID: !!adminID, password: !!password }
        });
    }

    try {
        // Find admin and check if they're already logged in
        const admin = await Admin.findOne({ adminID });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check if there's an active session and clear it
        if (admin.sessionExpiry && new Date(admin.sessionExpiry) > new Date()) {
            await Admin.findByIdAndUpdate(admin._id, { 
                sessionExpiry: null,
                lastLoginAt: null
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Set new session expiry
        const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await Admin.findByIdAndUpdate(admin._id, { 
            sessionExpiry, 
            lastLoginAt: new Date() 
        });
        
        // Generate new JWT token
        const token = generateToken({
            id: admin._id,
            adminID: admin.adminID,
            role: 'admin'
        });

        res.status(200).json({
            message: `Welcome ${admin.firstName} ${admin.lastName || ''}`.trim(),
            token,
            user: {
                id: admin.adminID,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: 'admin'
            }
        });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

// 🔥 Logout Admin
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const { extractTokenFromHeader, verifyToken } = require('../../utlis/jwtHelpers');
                const decoded = verifyToken(token);
                if (decoded && decoded.adminID) {
                    // Clear the session
                    await Admin.findOneAndUpdate(
                        { adminID: decoded.adminID },
                        { 
                            sessionExpiry: null,
                            lastLoginAt: null
                        }
                    );
                }
            } catch (error) {
                console.log('Token verification failed during logout:', error.message);
            }
        }

        // Clear any cookies and send success response
        res.clearCookie('admin_token');
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (err) {
        console.error("Admin Logout Error:", err);
        res.status(500).json({ message: "Server error during logout" });
    }
};

