import mongoose from "mongoose";

import { env } from "./env.js";

let isConnected = false;

export async function connectDB(): Promise<void> {
	if (isConnected) return;
	await mongoose.connect(env.MONGODB_URI);
	isConnected = true;
}
