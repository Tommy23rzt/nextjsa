import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.set("sanitizeFilter", true);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connect = async () => {
  const MONGODB_URI = process.env.MONGO;

  if (!MONGODB_URI) {
    console.error("MONGO environment variable is missing");
    throw new Error("Database unavailable");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection error:", error.message);
    throw new Error("Database unavailable");
  }
};

export default connect;