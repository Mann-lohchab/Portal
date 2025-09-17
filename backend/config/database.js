const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
<<<<<<< HEAD
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        console.log('🔄 Server will continue without database connection');
        // Don't exit - let server start without DB for now
        return false;
    }
    return true;
=======
        console.log(' MongoDB connected successfully');
    } catch (err) {
        console.error(' MongoDB connection failed:', err);
        process.exit(1); // Exit process if DB connection fails
    }
>>>>>>> b5b54b31 (Set up the project to run in the Replit environment)
};
module.exports = connectDB;
