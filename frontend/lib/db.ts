/// <reference types="node" />
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  mongoose?: MongooseCache;
};

const cached = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI as string);
  }

  cached.conn = await cached.promise;
  globalForMongoose.mongoose = cached;

  return cached.conn;
}
