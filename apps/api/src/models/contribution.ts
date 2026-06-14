import mongoose from "mongoose";

import type { ContributionEntry } from "../types/github.js";

const schema = new mongoose.Schema<ContributionEntry>({
	date: { type: String, required: true, unique: true },
	count: { type: Number, required: true },
	level: { type: Number, required: true },
});

export const Contribution =
	(mongoose.models.Contribution as mongoose.Model<ContributionEntry>) ??
	mongoose.model<ContributionEntry>("Contribution", schema);
