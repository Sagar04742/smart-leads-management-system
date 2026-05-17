import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not defined');
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB error:', error);
    process.exit(1);
  }
};

export default connectDB;
