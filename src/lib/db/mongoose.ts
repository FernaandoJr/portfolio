import mongoose from "mongoose";

import { preferPublicDnsIfLoopback } from "@/lib/dns";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalWithMongoose = global as typeof globalThis & { mongoose?: MongooseCache };
const cached: MongooseCache = globalWithMongoose.mongoose ?? { conn: null, promise: null };
globalWithMongoose.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
	if (cached.conn && mongoose.connection.readyState === 1) {
		return cached.conn;
	}

	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new Error("MONGODB_URI is not set");
	}

	cached.conn = null;

	if (mongoose.connection.readyState === 0) {
		cached.promise = null;
	}

	if (!cached.promise) {
		preferPublicDnsIfLoopback();
		cached.promise = mongoose
			.connect(uri, {
				serverSelectionTimeoutMS: 8_000,
			})
			.catch((err) => {
				cached.promise = null;
				throw err;
			});
	}

	cached.conn = await cached.promise;

	if (mongoose.connection.readyState !== 1) {
		cached.conn = null;
		cached.promise = null;
		throw new Error(`MongoDB not ready (state ${mongoose.connection.readyState})`);
	}

	return cached.conn;
}
