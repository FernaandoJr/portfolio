import mongoose from "mongoose";

import { usePublicDnsIfLoopback } from "@/lib/dns";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalWithMongoose = global as typeof globalThis & { mongoose?: MongooseCache };
const cached: MongooseCache = globalWithMongoose.mongoose ?? { conn: null, promise: null };
globalWithMongoose.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		usePublicDnsIfLoopback();
		cached.promise = mongoose.connect(process.env.MONGODB_URI!).catch((err) => {
			cached.promise = null;
			throw err;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
