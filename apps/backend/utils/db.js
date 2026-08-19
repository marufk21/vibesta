import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('mongodb connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};
export default connectDB;
