import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
      dbName: "event", // ✅ specify DB name instead of appending
    });
    console.log("✅ Successfully connected to MongoDB");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // exit process if connection fails
  }
};

export default connectDB;
