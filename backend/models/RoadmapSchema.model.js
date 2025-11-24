import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema({
  accountId: { type: String, default: null },
  teamId: { type: String, default: null },
  ownerType: { type: String, enum: ["account", "team"], default: "account" },
  name: { type: String, required: true },
  roadmapId: { type: String, required: true },
  nodes: { type: Array, default: [] },
  edges: { type: Array, default: [] },
}, { timestamps: true, versionKey: false });

RoadmapSchema.pre("validate", function(next) {
  if (!this.accountId && !this.teamId) {
    next(new Error("Roadmap document must belong to either an account or a team"));
    return;
  }
  next();
});

export default mongoose.model("Roadmap", RoadmapSchema);