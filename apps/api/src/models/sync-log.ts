import mongoose from "mongoose";

const schema = new mongoose.Schema({
	_id: { type: String, default: "singleton" },
	synced_at: { type: String, required: true },
});

export const SyncLog =
	mongoose.models.SyncLog ?? mongoose.model("SyncLog", schema);
