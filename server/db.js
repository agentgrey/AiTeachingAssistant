const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ mongoDB is vibing ✨');
  } catch (err) {
    console.error('❌ mongoDB failed to connect:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;