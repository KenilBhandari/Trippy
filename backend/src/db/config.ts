import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/traveller";


if (!MONGO_URI) {
  throw new Error("MONGO_URI not defined");
}

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

function getCache(): MongooseCache {
  if (!globalWithMongoose._mongooseCache) {
    globalWithMongoose._mongooseCache = {
      conn: null,
      promise: null,
    };
  }
  return globalWithMongoose._mongooseCache;
}

export default async function connectDB(): Promise<Mongoose> {
  const cache = getCache();

  if (cache.conn) return cache.conn;
  console.log("ENV CHECK:", !!process.env.MONGO_URI, MONGO_URI);

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
